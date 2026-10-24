import { config } from "@/lib/config";
import { hmacSha256Hex, timingSafeEqualHex } from "@/lib/security/hmac";
import type { CreatePaymentOrderInput, PaymentProvider } from "./types";

function basicAuth(keyId: string, secret: string) {
  return `Basic ${btoa(`${keyId}:${secret}`)}`;
}

export class RazorpayProvider implements PaymentProvider {
  async createOrder(input: CreatePaymentOrderInput) {
    if (!config.razorpayKeyId || !config.razorpayKeySecret) {
      throw new Error("Razorpay test credentials are not configured.");
    }
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: basicAuth(config.razorpayKeyId, config.razorpayKeySecret),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountPaise,
        currency: input.currency,
        receipt: input.receipt,
        notes: { internal_order_id: input.internalOrderId },
      }),
    });
    if (!response.ok) throw new Error(`Razorpay order creation failed (${response.status}).`);
    const data = (await response.json()) as { id: string; amount: number; currency: string };
    if (data.amount !== input.amountPaise || data.currency !== input.currency) {
      throw new Error("Razorpay returned an unexpected order amount or currency.");
    }
    return {
      provider: "razorpay" as const,
      providerOrderId: data.id,
      amountPaise: data.amount,
      currency: "INR" as const,
      keyId: config.razorpayKeyId,
    };
  }

  async verifyCheckoutSignature(input: {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }) {
    if (!config.razorpayKeySecret) return false;
    const expected = await hmacSha256Hex(
      `${input.providerOrderId}|${input.providerPaymentId}`,
      config.razorpayKeySecret,
    );
    return timingSafeEqualHex(expected, input.signature);
  }

  async verifyWebhook(rawBody: string, signature: string) {
    if (!config.razorpayWebhookSecret) return false;
    const expected = await hmacSha256Hex(rawBody, config.razorpayWebhookSecret);
    return timingSafeEqualHex(expected, signature);
  }

  async fetchPayment(paymentId: string) {
    if (!config.razorpayKeyId || !config.razorpayKeySecret) throw new Error("Razorpay credentials are not configured.");
    const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: basicAuth(config.razorpayKeyId, config.razorpayKeySecret) },
    });
    if (!response.ok) throw new Error(`Razorpay payment lookup failed (${response.status}).`);
    return await response.json() as { id: string; order_id: string; amount: number; currency: string; status: string; captured: boolean };
  }
}
