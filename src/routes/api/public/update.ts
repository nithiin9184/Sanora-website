import { createFileRoute } from "@tanstack/react-router";

const MANIFEST = {
  latestVersion: "6.2.2",
  minSupportedVersion: "1.0.0",
  apkUrl: "https://sanoramusic.in/api/public/download",
  releaseDate: "2026-10-25",
  highlights: [
    "Fast Razorpay UPI Checkout for Google Pay, PhonePe and Paytm",
    "Smart coupon auto-selection with SANORA9184 for Plus 1-Month",
    "New Plus (₹39/1M) and Pro (₹69/2M) plans with 48h grace protection",
    "Expanded JioSaavn pool to 250 songs with smart deduplication",
    "Real 320kbps audio bitrate and Apple Music style crossfades",
    "Full-screen player locked with ambient glow and smooth lyrics sync",
    "Real storage cache calculation and complete cache purge"
  ]
};

export const Route = createFileRoute("/api/public/update")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      },
      GET: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        return new Response(JSON.stringify(MANIFEST), {
          status: 200,
          headers: {
            ...corsHeaders(request),
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        });
      },
    },
  },
});
