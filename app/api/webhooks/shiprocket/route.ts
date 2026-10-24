import { config } from "@/lib/config";
import { rpc } from "@/lib/db/supabase-rest";

export async function POST(request: Request) {
  if (!config.shiprocketWebhookToken) return Response.json({ error: "Webhook not configured." }, { status: 503 });
  const token = request.headers.get("x-api-key") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (token !== config.shiprocketWebhookToken) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!payload) return Response.json({ error: "Invalid payload." }, { status: 400 });
  const awb = String(payload.awb ?? payload.awb_code ?? "").slice(0, 100);
  const externalStatus = String(payload.current_status ?? payload.status ?? "unknown").slice(0, 120);
  const eventId = String(payload.event_id ?? `${awb}:${externalStatus}:${String(payload.scans ?? payload.updated_at ?? "")}`).slice(0, 250);
  if (!awb) return Response.json({ error: "Missing AWB." }, { status: 400 });
  try { await rpc("process_shiprocket_event", { p_event_id: eventId, p_awb: awb, p_external_status: externalStatus, p_occurred_at: payload.updated_at ?? null, p_safe_payload: { courier: payload.courier_name ?? null, location: payload.current_location ?? null } }); return Response.json({ received: true }); }
  catch { return Response.json({ error: "Webhook processing failed." }, { status: 500 }); }
}
