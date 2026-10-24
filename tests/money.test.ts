import { describe, expect, it } from "vitest";
import { calculateTotals, formatINR } from "@/lib/commerce/money";

describe("integer paise totals", () => {
  it("calculates without floating point money", () => {
    const totals = calculateTotals([{ variantId: "v", productId: "p", productSlug: "p", title: "Object", variantName: "Clay", sku: "SKU", unitPricePaise: 19900, quantity: 3, lineTotalPaise: 59700 }], { discountPaise: 700, shippingPaise: 5000, taxPaise: 0 });
    expect(totals).toEqual({ subtotalPaise: 59700, discountPaise: 700, shippingPaise: 5000, taxPaise: 0, totalPaise: 64000, currency: "INR" });
    expect(formatINR(19900)).toContain("199.00");
  });
  it("never discounts below zero", () => expect(calculateTotals([], { discountPaise: 999 }).totalPaise).toBe(0));
});
