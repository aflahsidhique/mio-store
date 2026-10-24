import { config } from "@/lib/config";
import { rpc } from "@/lib/db/supabase-rest";
import { RazorpayProvider } from "@/lib/payments/razorpay";

export async function POST(request: Request) {
  if (!config.razorpayWebhookSecret) return Response.json({ error: "Webhook not configured." }, { status: 503 });
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const eventId = request.headers.get("x-razorpay-event-id") ?? "";
  if (!signature || !eventId || !(await new RazorpayProvider().verifyWebhook(rawBody, signature))) return Response.json({ error: "Invalid signature." }, { status: 401 });
  let payload: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; currency?: string; status?: string; captured?: boolean } } } };
  try { payload = JSON.parse(rawBody) as typeof payload; } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  const payment = payload.payload?.payment?.entity;
  try {
    await rpc("process_razorpay_event", { p_event_id: eventId, p_event_type: payload.event ?? "unknown", p_provider_order_id: payment?.order_id ?? null, p_provider_payment_id: payment?.id ?? null, p_amount_paise: payment?.amount ?? null, p_currency: payment?.currency ?? null, p_payment_status: payment?.status ?? null, p_captured: payment?.captured ?? false });
    return Response.json({ received: true });
  } catch { return Response.json({ error: "Webhook processing failed." }, { status: 500 }); }
}
