import { z } from "zod";
import { capabilities } from "@/lib/config";
import { rpc } from "@/lib/db/supabase-rest";

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), subject: z.string().trim().min(3).max(160), message: z.string().trim().min(20).max(4000), website: z.string().max(0).optional().default("") });

export async function POST(request: Request) {
  if (!capabilities.database) return Response.json({ error: "Contact storage is not configured. No message was sent." }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please review the form fields." }, { status: 400 });
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  try { const allowed = await rpc<boolean>("consume_rate_limit", { p_key: `contact:${ip}`, p_limit: 5, p_window_seconds: 3600 }); if (!allowed) return Response.json({ error: "Too many messages. Please try again later." }, { status: 429 }); await rpc("create_contact_message", { p_name: parsed.data.name, p_email: parsed.data.email, p_subject: parsed.data.subject, p_message: parsed.data.message }); return Response.json({ message: "Your message was saved for the studio." }, { status: 201 }); }
  catch { return Response.json({ error: "The message could not be stored. Please try again later." }, { status: 500 }); }
}
