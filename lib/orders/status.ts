import type { OrderStatus } from "@/lib/commerce/types";

const transitions: Record<OrderStatus, readonly OrderStatus[]> = {
  pending_payment: ["payment_failed", "paid", "cancelled"],
  payment_failed: ["pending_payment", "cancelled"],
  paid: ["processing", "production", "refund_pending", "cancelled", "on_hold"],
  processing: ["production", "quality_check", "packed", "on_hold", "cancelled", "refund_pending"],
  production: ["quality_check", "on_hold", "cancelled", "refund_pending"],
  quality_check: ["production", "packed", "on_hold"],
  packed: ["shipped", "on_hold", "shipment_exception"],
  shipped: ["out_for_delivery", "delivered", "shipment_exception"],
  out_for_delivery: ["delivered", "shipment_exception"],
  delivered: ["refund_pending"],
  on_hold: ["processing", "production", "quality_check", "packed", "cancelled", "refund_pending"],
  shipment_exception: ["shipped", "out_for_delivery", "on_hold"],
  cancelled: ["refund_pending", "refunded"],
  refund_pending: ["refunded", "paid", "cancelled"],
  refunded: [],
};

export function canTransitionOrder(from: OrderStatus, to: OrderStatus) {
  return transitions[from].includes(to);
}

export function assertOrderTransition(from: OrderStatus, to: OrderStatus) {
  if (!canTransitionOrder(from, to)) {
    throw new Error(`Illegal order status transition: ${from} → ${to}`);
  }
}
