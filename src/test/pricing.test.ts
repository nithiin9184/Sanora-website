import { describe, expect, it } from "vitest";
import { discountedAmount, expiryFrom, LAUNCH_COUPON_PERCENT, LAUNCH_COUPON_SLOTS, PLANS } from "@/lib/pricing";

describe("pricing", () => {
  it("charges ₹39 / ₹69 / ₹99", () => {
    expect([PLANS["pro-1m"].amount, PLANS["pro-2m"].amount, PLANS["pro-3m"].amount]).toEqual([3900, 6900, 9900]);
  });
  it("SANORA9184 takes 40% off the 1 Month plan", () => expect(discountedAmount("pro-1m", LAUNCH_COUPON_PERCENT)).toBe(2300));
  it("launch coupon has 509 slots", () => expect(LAUNCH_COUPON_SLOTS).toBe(509));
  it("3 month plan expires 3 months later", () => expect(expiryFrom("pro-3m", new Date("2026-01-15T00:00:00Z")).getUTCMonth()).toBe(3));
});
