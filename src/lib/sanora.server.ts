import { createClient } from "@supabase/supabase-js";

/** Service-role client for the SANORA mobile app database. Server-only. */
export function sanoraAdmin() {
  const url = process.env["SANORA_SUPABASE_URL"];
  const key = process.env["SANORA_SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Payment service is not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function razorpayKeys() {
  const id = process.env["RAZORPAY_KEY_ID"];
  const secret = process.env["RAZORPAY_KEY_SECRET"];
  if (!id || !secret) throw new Error("Payment service is not configured");
  return { id, secret };
}

const enc = new TextEncoder();
export async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

const ORIGINS = ["https://sanoramusic.in", "https://www.sanoramusic.in", "capacitor://localhost", "http://localhost", "https://localhost", "ionic://localhost"];
export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : "https://sanoramusic.in",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
export function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
}

/** Verifies the app user's bearer token against the SANORA auth service. */
export async function requireUser(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await sanoraAdmin().auth.getUser(token);
  return error || !data.user ? null : data.user;
}

export type CouponRow = { code: string; discount_percent: number; max_redemptions: number; redeemed_count: number; plan_ids: string[] | null; active: boolean };
export async function findCoupon(code: string) {
  const { data } = await sanoraAdmin().from("coupons").select("code, discount_percent, max_redemptions, redeemed_count, plan_ids, active").eq("code", code.trim().toUpperCase()).maybeSingle();
  return (data as CouponRow | null) ?? null;
}
