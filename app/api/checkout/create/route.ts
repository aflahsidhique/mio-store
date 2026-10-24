import { capabilities } from "@/lib/config";
import { rpc } from "@/lib/db/supabase-rest";
import { RazorpayProvider } from "@/lib/payments/razorpay";
import { checkoutSchema } from "@/lib/validation/checkout";

type CheckoutOrder = {
  orderId: string;
  orderNumber: string;
  publicToken: string;
  totalPaise: number;
  currency: "INR";
  providerOrderId?: string;
};

export async function POST(request: Request) {
  if (!capabilities.database || !capabilities.payments) {
    return Response.json({ error: "Secure checkout is not configured in this preview. Connect Supabase and Razorpay test credentials first." }, { status: 503 });
  }
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please review the checkout fields and try again.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  try {
    const clientAddress = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const allowed = await rpc<boolean>("consume_rate_limit", { p_key: `checkout:${clientAddress}`, p_limit: 8, p_window_seconds: 600 });
    if (!allowed) return Response.json({ error: "Too many checkout attempts. Please wait and try again." }, { status: 429 });

    const order = await rpc<CheckoutOrder>("create_checkout_order", {
      p_idempotency_key: parsed.data.idempotencyKey,
      p_customer: parsed.data.customer,
      p_address: parsed.data.address,
      p_lines: parsed.data.lines,
    });
    let providerOrderId = order.providerOrderId;
    if (!providerOrderId) {
      const payment = await new RazorpayProvider().createOrder({ amountPaise: order.totalPaise, currency: order.currency, receipt: order.orderNumber, internalOrderId: order.orderId });
      providerOrderId = payment.providerOrderId;
      await rpc("attach_payment_order", { p_order_id: order.orderId, p_provider_order_id: providerOrderId, p_amount_paise: order.totalPaise, p_currency: order.currency });
    }
    return Response.json({ order: { orderNumber: order.orderNumber, publicToken: order.publicToken }, payment: { providerOrderId, amountPaise: order.totalPaise, currency: order.currency, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID } });
  } catch (error) {
    console.error("checkout_create_failed", { name: error instanceof Error ? error.name : "Unknown" });
    return Response.json({ error: error instanceof Error && error.message.includes("stock") ? "One or more items are no longer available." : "Secure checkout could not be created. No payment was taken." }, { status: 500 });
  }
}
