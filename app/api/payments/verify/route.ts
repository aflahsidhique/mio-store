import { z } from "zod";
import { rpc } from "@/lib/db/supabase-rest";
import { RazorpayProvider } from "@/lib/payments/razorpay";
import { hashToken } from "@/lib/security/tokens";

const schema = z.object({
  razorpay_order_id: z.string().min(5).max(100),
  razorpay_payment_id: z.string().min(5).max(100),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/i),
  publicToken: z.string().regex(/^[a-f0-9]{48}$/i),
});

type VerificationOrder = { id: string; providerOrderId: string; totalPaise: number; currency: string };

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid payment response." }, { status: 400 });
  try {
    const order = await rpc<VerificationOrder>("get_order_for_payment_verification", { p_token_hash: await hashToken(parsed.data.publicToken) });
    if (!order || order.providerOrderId !== parsed.data.razorpay_order_id) return Response.json({ error: "Payment does not match this order." }, { status: 403 });
    const provider = new RazorpayProvider();
    const valid = await provider.verifyCheckoutSignature({ providerOrderId: order.providerOrderId, providerPaymentId: parsed.data.razorpay_payment_id, signature: parsed.data.razorpay_signature });
    if (!valid) return Response.json({ error: "Payment signature rejected." }, { status: 403 });
    const payment = await provider.fetchPayment(parsed.data.razorpay_payment_id);
    if (payment.order_id !== order.providerOrderId || payment.amount !== order.totalPaise || payment.currency !== order.currency || payment.status !== "captured" || !payment.captured) {
      return Response.json({ state: "pending", error: "Payment is authentic but not captured yet. Status will update from the verified webhook." }, { status: 202 });
    }
    await rpc("confirm_captured_payment", { p_order_id: order.id, p_provider_payment_id: payment.id, p_amount_paise: payment.amount, p_currency: payment.currency, p_source: "checkout_verification" });
    return Response.json({ state: "paid" });
  } catch {
    return Response.json({ error: "Payment verification is temporarily unavailable." }, { status: 500 });
  }
}
