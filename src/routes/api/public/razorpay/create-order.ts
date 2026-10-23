import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PLAN_IDS, PLANS, discountedAmount } from "@/lib/pricing";

const Body = z.object({ planId: z.enum(PLAN_IDS), couponCode: z.string().trim().max(40).optional() });

export const Route = createFileRoute("/api/public/razorpay/create-order")({
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
          if (!parsed.success) return s.json(request, { error: "Invalid plan" }, 400);
          const { planId, couponCode } = parsed.data;

          let amount: number = PLANS[planId].amount;
          let appliedCoupon: string | null = null;
          if (couponCode) {
            const c = await s.findCoupon(couponCode);
            if (!c || !c.active) return s.json(request, { error: "Invalid coupon code" }, 400);
            if (c.redeemed_count >= c.max_redemptions) return s.json(request, { error: "This coupon is fully claimed" }, 400);
            if (c.plan_ids?.length && !c.plan_ids.includes(planId)) return s.json(request, { error: "Coupon not valid for this plan" }, 400);
            amount = discountedAmount(planId, c.discount_percent);
            appliedCoupon = c.code;
          }

          const { id, secret } = s.razorpayKeys();
          const res = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Basic ${btoa(`${id}:${secret}`)}` },
            body: JSON.stringify({ amount, currency: "INR", receipt: `sn_${Date.now()}`, notes: { userId: user.id, planId, coupon: appliedCoupon ?? "" } }),
          });
          if (!res.ok) {
            console.error("Razorpay order failed", res.status, await res.text());
            return s.json(request, { error: "Couldn't start payment" }, 502);
          }
          const order = (await res.json()) as { id: string; amount: number };
          return s.json(request, { orderId: order.id, amount: order.amount, currency: "INR", keyId: id, planId, coupon: appliedCoupon });
        } catch (e) {
          console.error(e);
          return s.json(request, { error: "Payment service unavailable" }, 500);
        }
      },
    },
  },
});
