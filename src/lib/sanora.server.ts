import { createClient } from "@supabase/supabase-js";

export const DEFAULT_SUPABASE_URL = "https://kiisrtoqmrrwqljaafjq.supabase.co";

function getAllEnv(): Record<string, string> {
  const result: Record<string, string> = {};
  if (typeof process !== "undefined" && process.env) {
    for (const [k, v] of Object.entries(process.env)) {
      if (typeof v === "string" && v.trim()) result[k] = v.trim();
    }
  }
  const g = globalThis as unknown as { __env__?: Record<string, unknown> };
  if (g.__env__) {
    for (const [k, v] of Object.entries(g.__env__)) {
      if (typeof v === "string" && v.trim()) result[k] = v.trim();
    }
  }
  return result;
}

export function getServerEnv(key: string): string | undefined {
  const env = getAllEnv();
  if (env[key]) return env[key];
  const upperKey = key.toUpperCase();
  for (const [k, v] of Object.entries(env)) {
    if (k.toUpperCase() === upperKey) return v;
  }
  return undefined;
}

export function getMatchingEnv(...patterns: string[]): string | undefined {
  const env = getAllEnv();
  // First try exact matches
  for (const pat of patterns) {
    if (env[pat]) return env[pat];
  }
  // Then try case-insensitive or substring matching
  for (const pat of patterns) {
    const val = getServerEnv(pat);
    if (val) return val;
  }
  // Search for key containing patterns
  for (const [k, v] of Object.entries(env)) {
    const uk = k.toUpperCase();
    for (const pat of patterns) {
      if (uk.includes(pat.toUpperCase())) return v;
    }
  }
  return undefined;
}

export function getSupabaseServiceKey(): string | undefined {
  const env = getAllEnv();
  // Exact known names
  const direct =
    env["SANORA_SUPABASE_SERVICE_ROLE_KEY"] ||
    env["SUPABASE_SERVICE_ROLE_KEY"] ||
    env["SANORA_AUTH_SERVICE_ROLE_KEY"] ||
    env["SANORA_SUPABASE_SERVICE_KEY"] ||
    env["SANORA_SUPABASE_KEY"];
  if (direct) return direct;

  // Search by pattern
  for (const [k, v] of Object.entries(env)) {
    const uk = k.toUpperCase();
    if (uk.includes("SUPABASE") && (uk.includes("SERVICE") || uk.includes("SECRET") || uk.includes("KEY"))) {
      return v;
    }
  }
  return undefined;
}

export function getRazorpayKeySecret(): string | undefined {
  const env = getAllEnv();
  const direct = env["RAZORPAY_KEY_SECRET"] || env["RAZORPAY_SECRET_KEY"] || env["RAZORPAY_SECRET"];
  if (direct) return direct;
  for (const [k, v] of Object.entries(env)) {
    const uk = k.toUpperCase();
    if (uk.includes("RAZORPAY") && (uk.includes("SECRET") || uk.includes("KEY_S")) && !uk.includes("WEBHOOK")) {
      return v;
    }
  }
  return undefined;
}

export function getRazorpayWebhookSecret(): string | undefined {
  const env = getAllEnv();
  const direct = env["RAZORPAY_WEBHOOK_SECRET"] || env["RAZORPAY_WEBHOOK_KEY"];
  if (direct) return direct;
  for (const [k, v] of Object.entries(env)) {
    const uk = k.toUpperCase();
    if (uk.includes("RAZORPAY") && uk.includes("WEBHOOK")) {
      return v;
    }
  }
  return undefined;
}

export function sanoraAdmin() {
  const url =
    getServerEnv("SANORA_SUPABASE_URL") ||
    getServerEnv("SUPABASE_URL") ||
    getServerEnv("VITE_SUPABASE_URL") ||
    DEFAULT_SUPABASE_URL;
  const key = getSupabaseServiceKey();
  if (!url || !key) throw new Error("Payment service is not configured (missing Supabase credentials)");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function razorpayKeys() {
  const id = getServerEnv("RAZORPAY_KEY_ID") || "rzp_live_Tqo5UNYbDxV2gX";
  const secret = getRazorpayKeySecret();
  if (!id || !secret) throw new Error("Payment service is not configured (missing Razorpay secret)");
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
    throw new Error(error.message);
  }
  if (!data) return null;
  const max = data.max_uses ?? data.max_redemptions ?? 500;
  const used = data.used_count ?? data.redeemed_count ?? 0;
  return {
    code: data.code,
    discount_percent: data.discount_percent,
    max_uses: max,
    used_count: used,
    max_redemptions: max,
    redeemed_count: used,
    plan_ids: ["pro-1m"],
    active: data.active ?? true,
  } as CouponRow;
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
