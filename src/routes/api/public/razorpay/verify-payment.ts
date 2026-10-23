import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PLAN_IDS, expiryFrom } from "@/lib/pricing";

const Body = z.object({
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/),
});

export const Route = createFileRoute("/api/public/razorpay/verify-payment")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      },
      POST: async ({ request }) => {
        const s = await import("@/lib/sanora.server");
        try {
          const user = await s.requireUser(request);
          if (!user) return s.json(request, { error: "Please sign in" }, 401);
          const parsed = Body.safeParse(await request.json().catch(() => null));
          if (!parsed.success) return s.json(request, { error: "Invalid payment details" }, 400);
          const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: sig } = parsed.data;

          const { id, secret } = s.razorpayKeys();
          const expected = await s.hmacHex(secret, `${orderId}|${paymentId}`);
          if (!s.safeEqual(expected, sig)) return s.json(request, { error: "Payment verification failed" }, 400);

          // Read plan and coupon from the order itself, never from the client.
          const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, { headers: { Authorization: `Basic ${btoa(`${id}:${secret}`)}` } });
          if (!res.ok) return s.json(request, { error: "Order not found" }, 400);
          const order = (await res.json()) as { amount: number; status: string; notes?: { userId?: string; planId?: string; coupon?: string } };
          const planId = z.enum(PLAN_IDS).safeParse(order.notes?.planId);
          if (!planId.success || order.notes?.userId !== user.id) return s.json(request, { error: "Order mismatch" }, 403);

          const db = s.sanoraAdmin();
          const { data: existing } = await db.from("subscriptions").select("expires_at").eq("razorpay_payment_id", paymentId).maybeSingle();
          if (existing) return s.json(request, { ok: true, planId: planId.data, expiresAt: existing.expires_at });

          const expiresAt = expiryFrom(planId.data).toISOString();
          const { error: subErr } = await db.from("subscriptions").insert({
            user_id: user.id, plan_id: planId.data, amount: order.amount, coupon_code: order.notes?.coupon || null,
            razorpay_order_id: orderId, razorpay_payment_id: paymentId, status: "active", expires_at: expiresAt,
          });
          if (subErr) { console.error(subErr); return s.json(request, { error: "Couldn't save subscription" }, 500); }
          await db.from("profiles").update({ plan_id: planId.data, plan_expires_at: expiresAt }).eq("id", user.id);
          if (order.notes?.coupon) await db.rpc("redeem_coupon", { p_code: order.notes.coupon });

          return s.json(request, { ok: true, planId: planId.data, expiresAt });
        } catch (e) {
          console.error(e);
          return s.json(request, { error: "Payment service unavailable" }, 500);
        }
      },
    },
  },
});
