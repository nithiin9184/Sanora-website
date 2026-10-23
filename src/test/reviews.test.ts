import { describe, expect, it } from "vitest";
import { reviewPageCount, reviewPageRange } from "@/lib/reviews";

describe("Visitor review pagination", () => {
  it("has no numbered pages when there are no visitor reviews", () => {
    expect(reviewPageCount(0)).toBe(0);
  });
  it("adds numbered pages as visitor submissions exceed six per page", () => {
    expect(reviewPageCount(6)).toBe(1);
    expect(reviewPageCount(7)).toBe(2);
    expect(reviewPageCount(24)).toBe(4);
    expect(reviewPageCount(61)).toBe(11);
  });
  it("requests separate inclusive ranges without a sixty-review cap", () => {
    expect(reviewPageRange(1)).toEqual({ start: 0, end: 5 });
    expect(reviewPageRange(2)).toEqual({ start: 6, end: 11 });
    expect(reviewPageRange(11)).toEqual({ start: 60, end: 65 });
  });
});