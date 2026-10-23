// Browser-safe pricing rules shared by the website and payment endpoints.
export const PLANS = {
  "pro-1m": { amount: 3900, months: 1, label: "1 Month" },
  "pro-2m": { amount: 6900, months: 2, label: "2 Months" },
  "pro-3m": { amount: 9900, months: 3, label: "3 Months" },
} as const;
export type PlanId = keyof typeof PLANS;
export const PLAN_IDS = Object.keys(PLANS) as [PlanId, ...PlanId[]];

export const LAUNCH_COUPON = "SANORA9184";
export const LAUNCH_COUPON_PERCENT = 40;
export const LAUNCH_COUPON_SLOTS = 509;
/** The launch coupon is only valid on the 1 Month plan. */
export const LAUNCH_COUPON_PLANS: PlanId[] = ["pro-1m"];

/** Amount in paise after a percentage discount, rounded to whole rupees. */
export function discountedAmount(planId: PlanId, percent: number) {
  const base = PLANS[planId].amount;
  const p = Math.min(100, Math.max(0, percent));
  return Math.round((base * (100 - p)) / 100 / 100) * 100;
}

export function expiryFrom(planId: PlanId, from = new Date()) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + PLANS[planId].months);
  return d;
}
