import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      },
      GET: async ({ request }) => {
        const { corsHeaders, getSupabaseServiceKey, getRazorpayKeySecret } = await import("@/lib/sanora.server");
        const hasDb = Boolean(getSupabaseServiceKey());
        const hasRazorpay = Boolean(getRazorpayKeySecret());

        const body = {
          app: "sanora",
          payments: hasDb && hasRazorpay,
          coupons: hasDb,
        };
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
            ...corsHeaders(request),
          },
        });
      },
    },
  },
});
