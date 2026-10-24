export type CreatePaymentOrderInput = {
  amountPaise: number;
  currency: "INR";
  receipt: string;
  internalOrderId: string;
};

export type PaymentOrder = {
  provider: "razorpay";
  providerOrderId: string;
  amountPaise: number;
  currency: "INR";
  keyId: string;
};

export interface PaymentProvider {
  createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrder>;
  verifyCheckoutSignature(input: {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }): Promise<boolean>;
  verifyWebhook(rawBody: string, signature: string): Promise<boolean>;
}
