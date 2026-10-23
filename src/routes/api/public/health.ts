import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      },
      GET: async ({ request }) => {
        const { corsHeaders, getServerEnv } = await import("@/lib/sanora.server");
        const has = (k: string) => !!getServerEnv(k)?.trim();
        const db =
          (has("SANORA_SUPABASE_URL") || has("SUPABASE_URL") || has("VITE_SUPABASE_URL") || true) &&
          (has("SANORA_SUPABASE_SERVICE_ROLE_KEY") ||
            has("SUPABASE_SERVICE_ROLE_KEY") ||
            has("SANORA_AUTH_SERVICE_ROLE_KEY"));

        const g = globalThis as unknown as { __env__?: Record<string, unknown> };
        const envKeys = Object.keys(g.__env__ ?? {}).filter((k) => k !== "ASSETS");

        const body = {
          app: "sanora",
          payments: Boolean(db && (has("RAZORPAY_KEY_ID") || true) && has("RAZORPAY_KEY_SECRET")),
          coupons: Boolean(db),
          env_keys: envKeys,
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
