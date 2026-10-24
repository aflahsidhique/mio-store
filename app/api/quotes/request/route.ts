import { z } from "zod";
import { capabilities } from "@/lib/config";
import { uploadPrivateFile } from "@/lib/db/storage";
import { rpc } from "@/lib/db/supabase-rest";
import { validateUpload } from "@/lib/validation/upload";

const fieldsSchema = z.object({
  name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().regex(/^(?:\+91)?[6-9]\d{9}$/),
  requestType: z.enum(["existing_file","design_modify","prototype","functional_part","personalised_gift","bulk","unsure"]), quantity: z.coerce.number().int().min(1).max(1000),
  dimensions: z.string().trim().max(160).optional(), preference: z.string().trim().max(160).optional(), deadline: z.string().max(20).optional(), description: z.string().trim().min(20).max(4000),
  rightsConfirmed: z.literal("on"), privacyAccepted: z.literal("on"),
});

export async function POST(request: Request) {
  if (!capabilities.database) return Response.json({ error: "Private quote storage is not configured in this preview." }, { status: 503 });
  const data = await request.formData();
  const parsed = fieldsSchema.safeParse(Object.fromEntries(Array.from(data.entries()).filter(([key]) => key !== "files")));
  if (!parsed.success) return Response.json({ error: "Please review the request fields." }, { status: 400 });
  const files = data.getAll("files").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length > 5) return Response.json({ error: "Upload up to five files per request." }, { status: 400 });
  if (files.some((file) => !validateUpload(file).success)) return Response.json({ error: "One or more files has an unsupported type or exceeds 50 MB." }, { status: 400 });
  const clientAddress = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  try {
    const allowed = await rpc<boolean>("consume_rate_limit", { p_key: `quote:${clientAddress}`, p_limit: 5, p_window_seconds: 3600 });
    if (!allowed) return Response.json({ error: "Too many quote requests. Please wait before trying again." }, { status: 429 });
    const requestId = crypto.randomUUID();
    const uploaded = [] as Array<{ path: string; originalName: string; size: number; mime: string }>;
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${requestId}/${crypto.randomUUID()}.${extension}`;
      await uploadPrivateFile("custom-models", path, file);
      uploaded.push({ path, originalName: file.name.slice(0, 180), size: file.size, mime: file.type || "application/octet-stream" });
    }
    const result = await rpc<{ reference: string }>("create_custom_quote_request", { p_request_id: requestId, p_customer: { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone }, p_request: { requestType: parsed.data.requestType, quantity: parsed.data.quantity, dimensions: parsed.data.dimensions, preference: parsed.data.preference, deadline: parsed.data.deadline, description: parsed.data.description }, p_files: uploaded });
    return Response.json(result, { status: 201 });
  } catch { return Response.json({ error: "The request could not be stored securely. Please try again later." }, { status: 500 }); }
}
