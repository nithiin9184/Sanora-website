import { createServerFn } from "@tanstack/react-start";
import { LAUNCH_COUPON, LAUNCH_COUPON_SLOTS } from "./pricing";

/** Live claimed/total for the launch coupon; falls back to zero claimed if the app database is unreachable. */
export const getLaunchCoupon = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { findCoupon } = await import("./sanora.server");
    const c = await findCoupon(LAUNCH_COUPON);
    if (c) return { claimed: c.redeemed_count, total: c.max_redemptions, live: true };
  } catch { /* fall through */ }
  return { claimed: 0, total: LAUNCH_COUPON_SLOTS, live: false };
});
