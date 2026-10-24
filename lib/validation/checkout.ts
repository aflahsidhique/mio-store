import { z } from "zod";

export const cartLineSchema = z.object({
  variantId: z.string().min(1).max(120),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  idempotencyKey: z.string().uuid(),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().regex(/^(?:\+91)?[6-9]\d{9}$/),
  }),
  address: z.object({
    line1: z.string().trim().min(4).max(160),
    line2: z.string().trim().max(160).optional().default(""),
    locality: z.string().trim().min(2).max(100),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    pincode: z.string().regex(/^\d{6}$/),
    landmark: z.string().trim().max(120).optional().default(""),
  }),
  lines: z.array(cartLineSchema).min(1).max(30),
  policyAccepted: z.literal(true),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
