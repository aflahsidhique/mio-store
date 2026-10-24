import { describe, expect, it } from "vitest";
import { assertOrderTransition, canTransitionOrder } from "@/lib/orders/status";

describe("order status transitions", () => {
  it("allows the normal fulfilment path", () => { expect(canTransitionOrder("paid", "production")).toBe(true); expect(canTransitionOrder("packed", "shipped")).toBe(true); });
  it("rejects browser-style jumps to delivered", () => { expect(canTransitionOrder("pending_payment", "delivered")).toBe(false); expect(() => assertOrderTransition("pending_payment", "delivered")).toThrow(/Illegal/); });
});
