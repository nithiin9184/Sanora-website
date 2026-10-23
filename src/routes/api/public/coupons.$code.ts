import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/api/public/coupons/$code")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      },
      GET: async ({ request, params }) => {
        const s = await import("@/lib/sanora.server");
        const code = z.string().regex(/^[A-Za-z0-9_-]{1,40}$/).safeParse(params.code);
        if (!code.success) return s.json(request, { error: "Invalid code" }, 400);
        try {
          const c = await s.findCoupon(code.data);
          if (!c || !c.active) return s.json(request, { error: "Not found" }, 404);
          return s.json(request, {
            code: c.code,
            discountPercent: c.discount_percent,
            claimed: c.redeemed_count,
            total: c.max_redemptions,
            remaining: Math.max(0, c.max_redemptions - c.redeemed_count),
            planIds: c.plan_ids ?? ["pro-1m"],
          });
        } catch (e: any) {
          console.error("coupon endpoint error:", e);
          return s.json(request, { error: "Unavailable", message: e?.message ?? "Database error" }, 503);
        }
      },
    },
  },
});
