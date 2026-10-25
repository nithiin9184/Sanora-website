import { describe, it, expect, vi } from "vitest";
import { Route } from "../routes/api/public/download";
import { DIRECT_DOWNLOAD_URL, APK_URL } from "../lib/downloads";

describe("Public APK Download Endpoint", () => {
  it("exposes the correct direct download URL", () => {
    expect(DIRECT_DOWNLOAD_URL).toBe("/api/public/download");
    expect(APK_URL).toContain("Sanora");
  });

  it("handles OPTIONS request with 204 status", async () => {
    const handlers = (Route as any).options?.server?.handlers;
    expect(handlers).toBeDefined();
    const req = new Request("https://sanoramusic.in/api/public/download", { method: "OPTIONS" });
    const res = await handlers.OPTIONS({ request: req });
    expect(res.status).toBe(204);
  });

  it("serves GET request with attachment Content-Disposition and apk content-type", async () => {
    const handlers = (Route as any).options?.server?.handlers;
    expect(handlers).toBeDefined();

    // Mock global fetch for upstream APK
    const mockBlob = new Blob(["fake apk content"], { type: "application/vnd.android.package-archive" });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(mockBlob, {
      status: 200,
      headers: {
        "content-type": "application/vnd.android.package-archive",
        "content-length": "17",
      },
    }));

    try {
      const req = new Request("https://sanoramusic.in/api/public/download", { method: "GET" });
      const res = await handlers.GET({ request: req });
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/vnd.android.package-archive");
      expect(res.headers.get("Content-Disposition")).toBe('attachment; filename="sanora-music.apk"');
      expect(res.headers.get("Content-Length")).toBe("17");
      expect(res.headers.get("Cache-Control")).toContain("public");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("falls back to 302 redirect if upstream fetch fails", async () => {
    const handlers = (Route as any).options?.server?.handlers;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network failed"));

    try {
      const req = new Request("https://sanoramusic.in/api/public/download", { method: "GET" });
      const res = await handlers.GET({ request: req });
      expect(res.status).toBe(302);
      expect(res.headers.get("Location")).toBe(APK_URL);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
