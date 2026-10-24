import {
  sanoraAdmin,
  razorpayKeys,
  hmacHex,
  safeEqual,
  getServerEnv,
  redeemCouponInDb,
} from "./sanora.server";

const NATIVE_ORIGINS = [
  "https://sanoramusic.in",
  "https://www.sanoramusic.in",
  "capacitor://localhost",
  "http://localhost",
  "https://localhost",
  "ionic://localhost",
];

export function isServerFnRequest(request: Request): boolean {
  try {
    const url = new URL(request.url);
    return url.pathname.startsWith("/_serverFn/");
  } catch {
    return false;
  }
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const isAllowed =
    NATIVE_ORIGINS.includes(origin) ||
    origin === "https://sanoramusic.in" ||
    origin === "https://www.sanoramusic.in" ||
    origin.endsWith(".sanoramusic.in");

  const allowOrigin = isAllowed ? origin : (origin || "https://sanoramusic.in");

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, x-tsr-serverFn, Authorization, Accept, x-requested-with",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(request: Request, body: unknown, status = 200): Response {
  // TanStack Start client RPC protocol expects server function responses to be wrapped in `{ result: ... }`
  const payload =
    status >= 400 || (body && typeof body === "object" && ("result" in (body as any) || "error" in (body as any)))
      ? body
      : { result: body };

  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request),
    },
  });
}

// Plan definitions matching the mobile app
export interface ProPlan {
  id: "pro-1m" | "pro-2m" | "pro-3m";
  months: number;
  priceInr: number;
  label: string;
}

export const PRO_PLANS: Record<string, ProPlan> = {
  "pro-1m": { id: "pro-1m", months: 1, priceInr: 39, label: "1 Month" },
  "pro-2m": { id: "pro-2m", months: 2, priceInr: 69, label: "2 Months" },
  "pro-3m": { id: "pro-3m", months: 3, priceInr: 99, label: "3 Months" },
};

export function applyPercent(priceInr: number, percent: number): number {
  return Math.max(0, priceInr - Math.round((priceInr * Math.min(100, Math.max(0, percent))) / 100));
}

export function planExpiry(months: number, baseDate?: string | null): Date {
  const now = new Date();
  const base = baseDate && new Date(baseDate) > now ? new Date(baseDate) : now;
  const d = new Date(base.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}

async function getUserIdFromToken(accessToken: string): Promise<string | null> {
  if (!accessToken || typeof accessToken !== "string" || accessToken.trim().length < 10) {
    return null;
  }
  try {
    const admin = sanoraAdmin();
    const { data, error } = await admin.auth.getUser(accessToken.trim());
    if (error || !data.user) {
      return null;
    }
    return data.user.id;
  } catch (e) {
    console.error("Error verifying access token:", e);
    return null;
  }
}

// Known server function IDs dispatched by Android app
export const SERVER_FN_IDS = {
  validateCoupon: "f55cbfb360842522e6f3389b04207b5a185f1b8232a156668153317b71f79fc2",
  redeemFreeCoupon: "0aaed0f44a5de4cfbe0c9848f338a9212285e71579d2311792ac9664924b6be8",
  createRazorpayOrder: "4ada7f861624c4f58d49271efc9395ed8d752e76baca56080b8ee75529fd11b2",
  verifyRazorpayPayment: "03a47993cfaf4779f6f57da554b09ec9afec88ca5e46f35ac2ef975e070f90b9",
  getProStatus: "3f5e7c81c2b4d8836fddafd8795d7593280e0c88c8e9f0d95e02e9b81bde5cf7",
  setAutoRenew: "66296b68b7353d22fb979efa1b884260b7dbb516f97adc98ba02b6c313543e30",
} as const;

export async function handleServerFnRequest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  const url = new URL(request.url);
  const fnId = url.pathname.replace(/^\/_serverFn\/?/, "").split("/")[0]?.trim();

  let payload: any = undefined;
  try {
    const raw = await request.json();
    if (raw && typeof raw === "object" && "t" in raw) {
      const { fromJSON } = await import("seroval");
      const decoded = fromJSON(raw) as any;
      payload = decoded?.data ?? decoded;
    } else {
      payload = raw?.data ?? raw;
    }
  } catch {
    payload = {};
  }

  try {
    switch (fnId) {
      case SERVER_FN_IDS.validateCoupon:
        return await handleValidateCoupon(request, payload);

      case SERVER_FN_IDS.createRazorpayOrder:
        return await handleCreateRazorpayOrder(request, payload);

      case SERVER_FN_IDS.verifyRazorpayPayment:
        return await handleVerifyRazorpayPayment(request, payload);

      case SERVER_FN_IDS.getProStatus:
        return await handleGetProStatus(request, payload);

      case SERVER_FN_IDS.setAutoRenew:
        return await handleSetAutoRenew(request, payload);

      case SERVER_FN_IDS.redeemFreeCoupon:
        return await handleRedeemFreeCoupon(request, payload);

      default:
        return jsonResponse(request, { error: "Unknown server function", id: fnId }, 404);
    }
  } catch (err: any) {
    console.error(`Server function ${fnId} threw error:`, err);
    return jsonResponse(
      request,
      { ok: false, reason: "error", message: err?.message || "Server error" },
      200
    );
  }
}

async function handleValidateCoupon(request: Request, data: any): Promise<Response> {
  const code = typeof data?.code === "string" ? data.code.trim().toUpperCase() : "";
  const planId = data?.planId as string;
  const accessToken = data?.accessToken as string;

  if (!code || !planId) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "Please enter a coupon code.",
    });
  }

  const plan = PRO_PLANS[planId];
  if (!plan) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "Invalid plan selected.",
    });
  }

  let admin: any;
  try {
    admin = sanoraAdmin();
  } catch {
    return jsonResponse(request, {
      ok: false,
      reason: "not_configured",
      message: "Coupons aren't available right now.",
    });
  }

  const userId = await getUserIdFromToken(accessToken);
  if (!userId) {
    return jsonResponse(request, {
      ok: false,
      reason: "signed_out",
      message: "Sign in to apply a coupon.",
    });
  }

  // Look up coupon
  const { data: coupon, error: couponErr } = await admin
    .from("coupons")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (couponErr || !coupon) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "That coupon code isn't valid.",
    });
  }

  if (coupon.active === false) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "This coupon is no longer active.",
    });
  }

  if (coupon.expires_at && new Date(coupon.expires_at) <= new Date()) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "This coupon has expired.",
    });
  }

  const maxUses = coupon.max_uses ?? coupon.max_redemptions;
  const usedCount = coupon.used_count ?? coupon.redeemed_count ?? 0;
  if (maxUses != null && usedCount >= maxUses) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "This coupon has been fully used.",
    });
  }

  // Check if user already redeemed
  const { data: redemption } = await admin
    .from("coupon_redemptions")
    .select("id")
    .eq("coupon_id", coupon.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (redemption) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "You've already used this coupon.",
    });
  }

  // SANORA9184 is exclusively for the 1-month plan
  if (coupon.code === "SANORA9184" && planId !== "pro-1m") {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "This coupon is valid only for the 1 Month plan.",
    });
  }

  const discountPercent = Number(coupon.discount_percent ?? 0);
  const payableInr = applyPercent(plan.priceInr, discountPercent);

  return jsonResponse(request, {
    ok: true,
    code: coupon.code,
    discountPercent,
    priceInr: plan.priceInr,
    payableInr,
  });
}

async function handleCreateRazorpayOrder(request: Request, data: any): Promise<Response> {
  const planId = data?.planId as string;
  const couponCode = typeof data?.couponCode === "string" ? data.couponCode.trim().toUpperCase() : undefined;
  const accessToken = data?.accessToken as string;

  const plan = PRO_PLANS[planId];
  if (!plan) {
    return jsonResponse(request, {
      ok: false,
      reason: "error",
      message: "Invalid plan selected.",
    });
  }

  let admin: any;
  let keys: { id: string; secret: string };
  try {
    admin = sanoraAdmin();
    keys = razorpayKeys();
  } catch {
    return jsonResponse(request, {
      ok: false,
      reason: "not_configured",
      message: "Payments aren't connected yet. Nothing was charged.",
    });
  }

  const userId = await getUserIdFromToken(accessToken);
  if (!userId) {
    return jsonResponse(request, {
      ok: false,
      reason: "signed_out",
      message: "Please sign in to get Pro.",
    });
  }

  let payableInr = plan.priceInr;
  let appliedCouponCode: string | undefined = undefined;

  if (couponCode) {
    const { data: coupon } = await admin
      .from("coupons")
      .select("*")
      .eq("code", couponCode)
      .maybeSingle();

    if (!coupon || !coupon.active) {
      return jsonResponse(request, {
        ok: false,
        reason: "coupon_invalid",
        message: "That coupon code isn't valid.",
      });
    }

    if (coupon.code === "SANORA9184" && planId !== "pro-1m") {
      return jsonResponse(request, {
        ok: false,
        reason: "coupon_invalid",
        message: "This coupon is valid only for the 1 Month plan.",
      });
    }

    const discountPercent = Number(coupon.discount_percent ?? 0);
    payableInr = applyPercent(plan.priceInr, discountPercent);
    appliedCouponCode = coupon.code;
  }

  if (payableInr <= 0) {
    return jsonResponse(request, {
      ok: false,
      reason: "use_free_redeem",
      message: "This coupon makes the plan free — no payment needed.",
    });
  }

  const amountPaise = payableInr * 100;
  const receipt = `sanora_${plan.id}_${Date.now()}`;
  const notes: Record<string, string> = {
    plan_id: plan.id,
    user_id: userId,
  };
  if (appliedCouponCode) {
    notes.coupon_code = appliedCouponCode;
  }

  const authHeader = `Basic ${btoa(`${keys.id}:${keys.secret}`)}`;
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("Razorpay order creation failed:", res.status, errText);
    return jsonResponse(request, {
      ok: false,
      reason: "error",
      message: res.status === 401 ? "Payment configuration error." : "Couldn't start checkout. Please try again.",
    });
  }

  const orderData = (await res.json()) as { id?: string };
  if (!orderData.id) {
    return jsonResponse(request, {
      ok: false,
      reason: "error",
      message: "Couldn't start checkout. Please try again.",
    });
  }

  const mode = keys.id.startsWith("rzp_test_") ? "test" : "live";
  return jsonResponse(request, {
    ok: true,
    orderId: orderData.id,
    amountPaise,
    currency: "INR",
    keyId: keys.id,
    mode,
  });
}

async function handleVerifyRazorpayPayment(request: Request, data: any): Promise<Response> {
  const planId = data?.planId as string;
  const accessToken = data?.accessToken as string;
  const orderId = data?.razorpay_order_id as string;
  const paymentId = data?.razorpay_payment_id as string;
  const signature = data?.razorpay_signature as string;

  const plan = PRO_PLANS[planId];
  if (!plan || !orderId || !paymentId || !signature) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "Invalid payment details.",
    });
  }

  let admin: any;
  let keys: { id: string; secret: string };
  try {
    admin = sanoraAdmin();
    keys = razorpayKeys();
  } catch {
    return jsonResponse(request, {
      ok: false,
      reason: "not_configured",
      message: "Payment verification isn't connected yet.",
    });
  }

  const userId = await getUserIdFromToken(accessToken);
  if (!userId) {
    return jsonResponse(request, {
      ok: false,
      reason: "signed_out",
      message: "Please sign in again to finish activating Pro.",
    });
  }

  // Verify HMAC signature
  const expectedSignature = await hmacHex(keys.secret, `${orderId}|${paymentId}`);
  if (!safeEqual(expectedSignature, signature.toLowerCase())) {
    return jsonResponse(request, {
      ok: false,
      reason: "bad_signature",
      message: "We couldn't verify this payment signature.",
    });
  }

  // Confirm order with Razorpay
  const authHeader = `Basic ${btoa(`${keys.id}:${keys.secret}`)}`;
  const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: authHeader },
  });

  if (!orderRes.ok) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "We couldn't confirm this payment with Razorpay.",
    });
  }

  const order = (await orderRes.json()) as any;
  if (order.status !== "paid" || order.notes?.user_id !== userId || order.notes?.plan_id !== planId) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "This payment doesn't match your account or plan.",
    });
  }

  // Idempotency: check if subscription already exists
  const existing = await admin
    .from("subscriptions")
    .select("plan_id, current_period_end")
    .eq("razorpay_payment_id", paymentId)
    .maybeSingle();

  if (existing.data?.current_period_end) {
    const end = existing.data.current_period_end;
    await admin.from("profiles").upsert({
      id: userId,
      is_pro: true,
      pro_expires_at: end,
      pro_plan_id: plan.id,
      updated_at: new Date().toISOString(),
    });
    return jsonResponse(request, {
      ok: true,
      planId: plan.id,
      expiresAt: end,
      paymentId,
    });
  }

  const prof = await admin.from("profiles").select("pro_expires_at").eq("id", userId).maybeSingle();
  const end = planExpiry(plan.months, prof.data?.pro_expires_at ?? null).toISOString();
  const now = new Date().toISOString();

  const { error: insErr } = await admin.from("subscriptions").insert({
    user_id: userId,
    plan_id: plan.id,
    status: "active",
    amount_inr: Math.round(Number(order.amount_paid ?? order.amount) / 100),
    provider: "razorpay",
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    current_period_start: now,
    current_period_end: end,
  });

  if (insErr) {
    console.error("Subscription insert error:", insErr);
  }

  await admin.from("profiles").upsert({
    id: userId,
    is_pro: true,
    pro_expires_at: end,
    pro_plan_id: plan.id,
    updated_at: now,
  });

  // If a coupon was used, redeem it
  const couponCode = order.notes?.coupon_code;
  if (couponCode) {
    try {
      await redeemCouponInDb(couponCode, userId, paymentId);
    } catch (e) {
      console.warn("Redeem coupon RPC call failed:", e);
    }
  }

  return jsonResponse(request, {
    ok: true,
    planId: plan.id,
    expiresAt: end,
    paymentId,
  });
}

async function handleGetProStatus(request: Request, data: any): Promise<Response> {
  const accessToken = data?.accessToken as string;
  const userId = await getUserIdFromToken(accessToken);
  if (!userId) {
    return jsonResponse(request, null);
  }

  try {
    const admin = sanoraAdmin();
    const { data: p } = await admin
      .from("profiles")
      .select("is_pro, pro_expires_at, pro_plan_id, auto_renew")
      .eq("id", userId)
      .maybeSingle();

    const expiresAt = (p?.pro_expires_at as string | null) ?? null;
    const isPro = Boolean(p?.is_pro) && !!expiresAt && new Date(expiresAt) > new Date();

    return jsonResponse(request, {
      isPro,
      planId: isPro ? (p?.pro_plan_id ?? null) : null,
      expiresAt: isPro ? expiresAt : null,
      autoRenew: p?.auto_renew !== false,
    });
  } catch {
    return jsonResponse(request, null);
  }
}

async function handleSetAutoRenew(request: Request, data: any): Promise<Response> {
  const accessToken = data?.accessToken as string;
  const autoRenew = Boolean(data?.autoRenew);
  const userId = await getUserIdFromToken(accessToken);

  if (!userId) {
    return jsonResponse(request, { ok: false, autoRenew: !autoRenew });
  }

  try {
    const admin = sanoraAdmin();
    const { error } = await admin
      .from("profiles")
      .update({ auto_renew: autoRenew, updated_at: new Date().toISOString() })
      .eq("id", userId);

    return jsonResponse(request, { ok: !error, autoRenew: error ? !autoRenew : autoRenew });
  } catch {
    return jsonResponse(request, { ok: false, autoRenew: !autoRenew });
  }
}

async function handleRedeemFreeCoupon(request: Request, data: any): Promise<Response> {
  const code = typeof data?.code === "string" ? data.code.trim().toUpperCase() : "";
  const planId = data?.planId as string;
  const accessToken = data?.accessToken as string;

  const plan = PRO_PLANS[planId];
  if (!code || !plan) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "Invalid coupon or plan.",
    });
  }

  const userId = await getUserIdFromToken(accessToken);
  if (!userId) {
    return jsonResponse(request, {
      ok: false,
      reason: "signed_out",
      message: "Sign in to apply a coupon.",
    });
  }

  let admin: any;
  try {
    admin = sanoraAdmin();
  } catch {
    return jsonResponse(request, {
      ok: false,
      reason: "not_configured",
      message: "Coupons aren't available right now.",
    });
  }

  const { data: coupon } = await admin
    .from("coupons")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (!coupon || !coupon.active) {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "That coupon code isn't valid.",
    });
  }

  const discountPercent = Number(coupon.discount_percent ?? 0);
  if (applyPercent(plan.priceInr, discountPercent) > 0) {
    return jsonResponse(request, {
      ok: false,
      reason: "not_free",
      message: "This coupon needs a payment to finish.",
    });
  }

  const reference = `coupon_${coupon.code}_${crypto.randomUUID()}`;
  try {
    await redeemCouponInDb(coupon.code, userId, reference);
  } catch {
    return jsonResponse(request, {
      ok: false,
      reason: "invalid",
      message: "This coupon couldn't be redeemed.",
    });
  }

  const prof = await admin.from("profiles").select("pro_expires_at").eq("id", userId).maybeSingle();
  const end = planExpiry(plan.months, prof.data?.pro_expires_at ?? null).toISOString();
  const now = new Date().toISOString();

  await admin.from("subscriptions").insert({
    user_id: userId,
    plan_id: plan.id,
    status: "active",
    amount_inr: 0,
    provider: "coupon",
    razorpay_payment_id: reference,
    current_period_start: now,
    current_period_end: end,
  });

  await admin.from("profiles").upsert({
    id: userId,
    is_pro: true,
    pro_expires_at: end,
    pro_plan_id: plan.id,
    updated_at: now,
  });

  return jsonResponse(request, {
    ok: true,
    planId: plan.id,
    expiresAt: end,
    paymentId: reference,
  });
}
