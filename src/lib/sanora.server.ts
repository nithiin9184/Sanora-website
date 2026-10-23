import { createClient } from "@supabase/supabase-js";

export const DEFAULT_SUPABASE_URL = "https://kiisrtoqmrrwqljaafjq.supabase.co";

export function getServerEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env?.[key]?.trim()) {
    return process.env[key]!.trim();
  }
  const g = globalThis as unknown as { __env__?: Record<string, unknown> };
  if (g.__env__ && typeof g.__env__[key] === "string" && (g.__env__[key] as string).trim()) {
    return (g.__env__[key] as string).trim();
  }
  return undefined;
}

export function sanoraAdmin() {
  const url =
    getServerEnv("SANORA_SUPABASE_URL") ||
    getServerEnv("SUPABASE_URL") ||
    getServerEnv("VITE_SUPABASE_URL") ||
    DEFAULT_SUPABASE_URL;
  const key =
    getServerEnv("SANORA_SUPABASE_SERVICE_ROLE_KEY") ||
    getServerEnv("SUPABASE_SERVICE_ROLE_KEY") ||
    getServerEnv("SANORA_AUTH_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Payment service is not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function razorpayKeys() {
  const id = getServerEnv("RAZORPAY_KEY_ID") || "rzp_live_Tqo5UNYbDxV2gX";
  const secret = getServerEnv("RAZORPAY_KEY_SECRET");
  if (!id || !secret) throw new Error("Payment service is not configured");
  return { id, secret };
}

export interface CouponRow {
  code: string;
  discount_percent: number;
  max_uses: number;
  used_count: number;
  max_redemptions: number;
  redeemed_count: number;
  plan_ids: string[];
  active: boolean;
}

export async function findCoupon(code: string) {
  const { data, error } = await sanoraAdmin()
    .from("coupons")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();
  if (error) {
    console.error("findCoupon DB error:", error);
    return { db_error: error.message };
  }
  if (!data) return null;
  const max = data.max_uses ?? data.max_redemptions ?? 500;
  const used = data.used_count ?? data.redeemed_count ?? 0;
  return {
    coupon: {
      code: data.code,
      discount_percent: data.discount_percent,
      max_uses: max,
      used_count: used,
      max_redemptions: max,
      redeemed_count: used,
      plan_ids: ["pro-1m"],
      active: data.active ?? true,
    } as CouponRow,
  };
}

export async function redeemCouponInDb(code: string, userId: string, reference?: string) {
  const admin = sanoraAdmin();
  const { data, error } = await admin.rpc("redeem_coupon", {
    p_code: code.trim().toUpperCase(),
    p_user: userId,
    p_reference: reference ?? null,
  });
  if (error) {
    console.error("redeem_coupon RPC error:", error);
    throw new Error(error.message);
  }
  return typeof data === "number" ? data : null;
}

export function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "https://sanoramusic.in";
  return {
    "access-control-allow-origin": origin,
    vary: "Origin",
    "access-control-allow-headers": "Content-Type, Authorization",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-max-age": "86400",
  };
}

export function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...corsHeaders(request),
    },
  });
}
