import { describe, it, expect } from "vitest";
import { downloadTotal, formatDownloads, INITIAL_DOWNLOADS } from "@/lib/downloads";

describe("Download continuation", () => {
  it("starts at the requested 10.2k downloads", () => {
    expect(INITIAL_DOWNLOADS).toBe(10200);
    expect(formatDownloads(downloadTotal(0))).toBe("10.2k");
  });
  it("continues from 10200 and makes every added download visible", () => {
    expect(downloadTotal(1)).toBe(10201);
    expect(formatDownloads(downloadTotal(1))).toBe("10,201");
    expect(downloadTotal(800)).toBe(11000);
  });
});