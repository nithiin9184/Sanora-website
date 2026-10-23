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
          process.env["RAZORPAY_WEBHOOK_SECRET"] ||
          process.env["RAZORPAY_KEY_SECRET"];

        if (!webhookSecret) {
          console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
          return new Response(JSON.stringify({ error: "Webhook not configured" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const expected = await s.hmacHex(webhookSecret, rawBody);
        if (!s.safeEqual(expected, sig)) {
          console.error("Invalid webhook signature");
          return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const eventData = JSON.parse(rawBody);
          const event = eventData.event;

          if (event === "order.paid" || event === "payment.captured") {
            const payload = eventData.payload ?? {};
            const paymentEntity = payload.payment?.entity;
            const orderEntity = payload.order?.entity;

            const paymentId: string = paymentEntity?.id ?? "";
            const orderId: string = orderEntity?.id ?? paymentEntity?.order_id ?? "";
            const notes = paymentEntity?.notes ?? orderEntity?.notes ?? {};
            const userId: string = notes.userId ?? "";
            const planIdRaw = notes.planId;
            const couponCode: string | null = notes.coupon || null;
            const amount: number = Number(paymentEntity?.amount ?? orderEntity?.amount ?? 0);

            if (userId && planIdRaw && PLAN_IDS.includes(planIdRaw as PlanId)) {
              const planId = planIdRaw as PlanId;
              const db = s.sanoraAdmin();

              // Check if subscription already exists for this payment or order
              let query = db.from("subscriptions").select("id");
              if (paymentId) {
                query = query.eq("razorpay_payment_id", paymentId);
              } else if (orderId) {
                query = query.eq("razorpay_order_id", orderId);
              }

              const { data: existing } = await query.maybeSingle();

              if (!existing) {
                const expiresAt = expiryFrom(planId).toISOString();

                const { error: subErr } = await db.from("subscriptions").insert({
                  user_id: userId,
                  plan_id: planId,
                  amount,
                  coupon_code: couponCode,
                  razorpay_order_id: orderId || null,
                  razorpay_payment_id: paymentId || null,
                  status: "active",
                  expires_at: expiresAt,
                });

                if (subErr) {
                  console.error("Error inserting subscription via webhook:", subErr);
                } else {
                  await db
                    .from("profiles")
                    .update({ plan_id: planId, plan_expires_at: expiresAt })
                    .eq("id", userId);

                  if (couponCode) {
                    await db.rpc("redeem_coupon", {
                      p_code: couponCode,
                      p_user: userId,
                      p_reference: paymentId || orderId || "webhook",
                    });
                  }
                }
              }
            }
          }

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          console.error("Error processing webhook:", err);
          return new Response(JSON.stringify({ error: "Processing failed" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
