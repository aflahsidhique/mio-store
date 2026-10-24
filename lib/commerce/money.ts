import type { OrderTotals, PricedLine } from "./types";

export const formatINR = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(paise / 100);

export function calculateTotals(
  lines: PricedLine[],
  options: { discountPaise?: number; shippingPaise?: number; taxPaise?: number } = {},
): OrderTotals {
  const subtotalPaise = lines.reduce((sum, line) => sum + line.lineTotalPaise, 0);
  const discountPaise = Math.max(0, Math.min(options.discountPaise ?? 0, subtotalPaise));
  const shippingPaise = Math.max(0, options.shippingPaise ?? 0);
  const taxPaise = Math.max(0, options.taxPaise ?? 0);

  return {
    subtotalPaise,
    discountPaise,
    shippingPaise,
    taxPaise,
    totalPaise: subtotalPaise - discountPaise + shippingPaise + taxPaise,
    currency: "INR",
  };
}
