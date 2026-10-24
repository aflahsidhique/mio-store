import { z } from "zod";
import { rpc } from "@/lib/db/supabase-rest";
import { hashToken } from "@/lib/security/tokens";

const schema = z.object({ token: z.string().regex(/^[a-f0-9]{48}$/i), action: z.enum(["accept", "decline"]) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid quote action." }, { status: 400 });
  try { const result = await rpc<{ status: string }>("act_on_quote", { p_token_hash: await hashToken(parsed.data.token), p_action: parsed.data.action }); return Response.json({ ...result, message: parsed.data.action === "accept" ? "Quote accepted. The studio will issue the secure payment step." : "Quote declined." }); }
  catch { return Response.json({ error: "Quote is unavailable, expired or no longer actionable." }, { status: 409 }); }
}
