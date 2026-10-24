import { capabilities } from "@/lib/config";

export function GET() {
  return Response.json({ status: "ok", service: "mio-studio", integrations: capabilities }, { headers: { "Cache-Control": "no-store" } });
}
