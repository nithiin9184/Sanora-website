import { describe, expect, it } from "vitest";
import {
  applyPercent,
  isServerFnRequest,
  handleServerFnRequest,
  PRO_PLANS,
  SERVER_FN_IDS,
} from "../lib/server-fn-handler";

describe("Server function dispatcher", () => {
  it("detects server function requests", () => {
    expect(isServerFnRequest(new Request("https://sanoramusic.in/_serverFn/123"))).toBe(true);
    expect(isServerFnRequest(new Request("https://sanoramusic.in/api/public/health"))).toBe(false);
  });

  it("handles OPTIONS preflight with CORS headers", async () => {
    const req = new Request("https://sanoramusic.in/_serverFn/any", {
      method: "OPTIONS",
      headers: { Origin: "https://localhost" },
    });
    const res = await handleServerFnRequest(req);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://localhost");
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("calculates discounts accurately", () => {
    // SANORA9184 is 40% off 1-month (₹39) -> ₹23 payable
    expect(PRO_PLANS["pro-1m"].priceInr).toBe(39);
    expect(applyPercent(39, 40)).toBe(23);
    expect(applyPercent(69, 0)).toBe(69);
    expect(applyPercent(99, 100)).toBe(0);
  });

  it("rejects unknown server function IDs with 404", async () => {
    const req = new Request("https://sanoramusic.in/_serverFn/unknown_id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await handleServerFnRequest(req);
    expect(res.status).toBe(404);
  });

  it("wraps responses in TanStack Start result property", async () => {
    const req = new Request(
      `https://sanoramusic.in/_serverFn/${SERVER_FN_IDS.validateCoupon}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { code: "", planId: "pro-1m" } }),
      }
    );
    const res = await handleServerFnRequest(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    // TanStack Start client RPC extracts `json.result`
    expect(json).toHaveProperty("result");
    expect(json.result.ok).toBe(false);
    expect(json.result.reason).toBe("invalid");
  });
});
