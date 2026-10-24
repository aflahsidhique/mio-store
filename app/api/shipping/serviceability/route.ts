import { z } from "zod";
import { capabilities } from "@/lib/config";
import { ShiprocketProvider } from "@/lib/shipping/shiprocket";

const schema = z.object({ pickupPincode: z.string().regex(/^\d{6}$/), deliveryPincode: z.string().regex(/^\d{6}$/), weightKg: z.number().positive().max(50) });

export async function POST(request: Request) {
  if (!capabilities.shipping) return Response.json({ serviceable: null, source: "unavailable", message: "Live courier rates are not configured. Checkout remains disabled until an approved fallback is set." }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid pincode or package weight." }, { status: 400 });
  try { return Response.json(await new ShiprocketProvider().serviceability(parsed.data)); }
  catch { return Response.json({ error: "Courier serviceability could not be checked." }, { status: 502 }); }
}
