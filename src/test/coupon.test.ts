import { describe, expect, it } from "vitest";
import { couponTone } from "@/lib/coupon";
describe("couponTone", () => {
  it("is green when many slots remain", () => expect(couponTone(100, 500)).toBe("good"));
  it("is orange when slots are running low", () => expect(couponTone(400, 500)).toBe("warn"));
  it("is red when almost sold out", () => expect(couponTone(482, 500)).toBe("bad"));
});
