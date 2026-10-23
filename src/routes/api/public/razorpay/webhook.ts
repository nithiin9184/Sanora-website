import { createFileRoute } from "@tanstack/react-router";
import { PLAN_IDS, expiryFrom, type PlanId } from "@/lib/pricing";

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

        let event: { event?: string; payload?: Record<string, any> };
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const eventType = event.event;
        if (eventType !== "payment.captured" && eventType !== "order.paid") {
          return new Response(JSON.stringify({ status: "ignored", event: eventType }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        const payment = event.payload?.payment?.entity;
        const order = event.payload?.order?.entity;

        const notes = payment?.notes || order?.notes || {};
        const userId = notes.userId || notes.user_id;
        const planId = (notes.planId || notes.plan_id) as PlanId | undefined;
        const coupon = notes.coupon || notes.coupon_code;

        const orderId = payment?.order_id || order?.id;
        const paymentId = payment?.id;
        const amount = payment?.amount ?? order?.amount ?? 0;

        if (!userId || !planId || !PLAN_IDS.includes(planId)) {
          console.warn("Webhook event missing required notes (userId / planId):", { eventType, notes });
          return new Response(JSON.stringify({ status: "missing_metadata" }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const db = s.sanoraAdmin();
          if (paymentId) {
            const { data: existing } = await db
              .from("subscriptions")
              .select("id, status")
              .eq("razorpay_payment_id", paymentId)
              .maybeSingle();

            if (existing) {
              return new Response(JSON.stringify({ status: "already_processed" }), {
                status: 200,
                headers: { "content-type": "application/json" },
              });
            }
          }

          const expiresAt = expiryFrom(planId).toISOString();
          const { error: subErr } = await db.from("subscriptions").insert({
            user_id: userId,
            plan_id: planId,
            amount: amount,
            coupon_code: coupon || null,
            razorpay_order_id: orderId || null,
            razorpay_payment_id: paymentId || `wh_${Date.now()}`,
            status: "active",
            expires_at: expiresAt,
          });

          if (subErr) {
            console.error("Webhook insert subscription error:", subErr);
            return new Response(JSON.stringify({ error: "Database error" }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          await db
            .from("profiles")
            .update({ plan_id: planId, plan_expires_at: expiresAt })
            .eq("id", userId);

          if (coupon && paymentId) {
            try {
              await db.rpc("redeem_coupon", {
                p_code: coupon,
                p_user: userId,
                p_reference: paymentId,
              });
            } catch (couponErr) {
              console.warn("Webhook coupon redemption failed:", couponErr);
            }
          }

          return new Response(JSON.stringify({ status: "ok", userId, planId, expiresAt }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          console.error("Webhook handler error:", err);
          return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
