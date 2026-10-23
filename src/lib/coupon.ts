/** Green while plenty of slots remain, orange when running low, red when nearly gone. */
export function couponTone(claimed: number, total: number): "good" | "warn" | "bad" {
  const left = (total - claimed) / total;
  if (left > 0.4) return "good";
  if (left > 0.1) return "warn";
  return "bad";
}

