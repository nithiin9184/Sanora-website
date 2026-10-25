import { createFileRoute } from "@tanstack/react-router";
import { APK_URL } from "@/lib/downloads";

export const Route = createFileRoute("/api/public/download")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      },
      HEAD: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        try {
          const upstream = await fetch(APK_URL, { method: "HEAD" });
          const headers = new Headers(corsHeaders(request));
          headers.set("Content-Type", "application/vnd.android.package-archive");
          headers.set("Content-Disposition", 'attachment; filename="sanora-music.apk"');
          const length = upstream.headers.get("content-length");
          if (length) headers.set("Content-Length", length);
          headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
          return new Response(null, {
            status: upstream.ok ? 200 : upstream.status,
            headers,
          });
        } catch {
          return new Response(null, { status: 200, headers: corsHeaders(request) });
        }
      },
      GET: async ({ request }) => {
        const { corsHeaders } = await import("@/lib/sanora.server");
        try {
          const upstream = await fetch(APK_URL);
          if (upstream.ok) {
            const buffer = await upstream.arrayBuffer();
            const headers = new Headers(corsHeaders(request));
            headers.set("Content-Type", "application/vnd.android.package-archive");
            headers.set("Content-Disposition", 'attachment; filename="sanora-music.apk"');
            const length = upstream.headers.get("content-length") || buffer.byteLength.toString();
            headers.set("Content-Length", length);
            headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
            return new Response(buffer, { status: 200, headers });
          }
        } catch (err) {
          console.error("APK buffer download error:", err);
        }
        return Response.redirect(APK_URL, 302);
      },
    },
  },
});
