import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/razorpay/webhook")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      },
      POST: async ({ request }) => {
        const s = await import("@/lib/sanora.server");
        const sig = request.headers.get("x-razorpay-signature");
        if (!sig) {
          return new Response(JSON.stringify({ error: "Missing signature" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const rawBody = await request.text();
        const webhookSecret =
          s.getRazorpayWebhookSecret() ||
          s.getRazorpayKeySecret() ||
          s.getServerEnv("RAZORPAY_WEBHOOK_SECRET") ||
          s.getServerEnv("RAZORPAY_KEY_SECRET");

        if (!webhookSecret) {
          console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
          return new Response(JSON.stringify({ error: "Webhook not configured" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const expected = await s.hmacHex(webhookSecret, rawBody);
        if (!s.safeEqual(expected, sig)) {
          return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        let event: any;
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const evType = event?.event;
        if (evType !== "order.paid" && evType !== "payment.captured") {
          return new Response(JSON.stringify({ received: true, ignored: evType }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        const payment = event?.payload?.payment?.entity;
        const order = event?.payload?.order?.entity;
        const notes = payment?.notes ?? order?.notes ?? {};

        const userId = notes.user_id;
        const planId = notes.plan_id;
        const couponCode = notes.coupon_code;
        const orderId = order?.id ?? payment?.order_id;
        const paymentId = payment?.id;
        const amount = payment?.amount ?? order?.amount ?? 0;

        if (!userId || !planId) {
          console.warn("Webhook received payment without user_id / plan_id in notes", { orderId, paymentId });
          return new Response(JSON.stringify({ received: true, missing_notes: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const admin = s.sanoraAdmin();
          const { error: subErr } = await admin.from("subscriptions").insert({
            user_id: userId,
            plan_id: planId,
            status: "active",
            amount_inr: Math.round(Number(amount) / 100),
            provider: "razorpay",
            provider_order_id: orderId ?? null,
            provider_payment_id: paymentId ?? null,
          });
          if (subErr) console.error("Webhook subscription insert error:", subErr);

          const { expiryFrom } = await import("@/lib/pricing");
          const expiresAt = expiryFrom(planId).toISOString();

          await admin
            .from("profiles")
            .update({
              is_pro: true,
              pro_plan_id: planId,
              pro_expires_at: expiresAt,
              auto_renew: false,
            })
            .eq("id", userId);

          if (couponCode && typeof couponCode === "string") {
            try {
              await s.redeemCouponInDb(couponCode, userId, orderId ?? paymentId);
            } catch (err) {
              console.warn("Webhook coupon redeem error:", err);
            }
          }

          return new Response(JSON.stringify({ received: true, activated: true, user_id: userId }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          console.error("Webhook processing error:", err);
          return new Response(JSON.stringify({ error: "Processing failed", detail: err?.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
