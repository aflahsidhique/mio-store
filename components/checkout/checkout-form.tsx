"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { formatINR } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (name: string, callback: (response: unknown) => void) => void } }
}

function idempotencyKey() {
  return crypto.randomUUID();
}

export function CheckoutForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const { lines, clear } = useCart();
  const [state, setState] = useState<"idle" | "creating" | "paying" | "verifying" | "error">("idle");
  const [message, setMessage] = useState("");
  const [key] = useState(idempotencyKey);
  const detailed = useMemo(() => lines.flatMap((line) => { const product = products.find((candidate) => candidate.variants.some((variant) => variant.id === line.variantId)); const variant = product?.variants.find((candidate) => candidate.id === line.variantId); return product && variant ? [{ ...line, product, variant }] : []; }), [lines, products]);
  const estimatedSubtotal = detailed.reduce((sum, line) => sum + line.variant.pricePaise * line.quantity, 0);

  async function loadRazorpay() {
    if (window.Razorpay) return true;
    return await new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("creating"); setMessage("");
    const form = new FormData(event.currentTarget);
    const body = {
      idempotencyKey: key,
      customer: { name: form.get("name"), email: form.get("email"), phone: form.get("phone") },
      address: { line1: form.get("line1"), line2: form.get("line2"), locality: form.get("locality"), city: form.get("city"), state: form.get("state"), pincode: form.get("pincode"), landmark: form.get("landmark") },
      lines,
      policyAccepted: form.get("policyAccepted") === "on",
    };
    try {
      const response = await fetch("/api/checkout/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json() as { error?: string; order?: { publicToken: string; orderNumber: string }; payment?: { keyId: string; providerOrderId: string; amountPaise: number; currency: string } };
      if (!response.ok || !data.order || !data.payment) throw new Error(data.error ?? "Checkout could not be created.");
      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error("Razorpay Checkout could not be loaded.");
      setState("paying");
      const instance = new window.Razorpay({
        key: data.payment.keyId,
        amount: data.payment.amountPaise,
        currency: data.payment.currency,
        order_id: data.payment.providerOrderId,
        name: "MIO Studio",
        description: data.order.orderNumber,
        handler: async (paymentResponse: unknown) => {
          setState("verifying");
          const verification = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...paymentResponse as object, publicToken: data.order?.publicToken }) });
          if (!verification.ok) { setState("error"); setMessage("Payment response was received but is not yet verified. Use the order link to check status safely."); return; }
          clear();
          router.push(`/checkout/success?token=${encodeURIComponent(data.order?.publicToken ?? "")}`);
        },
        modal: { ondismiss: () => { setState("idle"); setMessage("Payment window closed. Your order remains pending and can be retried safely."); } },
        theme: { color: "#c43f24" },
      });
      instance.on("payment.failed", () => { setState("error"); setMessage("Payment failed. No order will be marked paid without server verification."); });
      instance.open();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Checkout is unavailable.");
    }
  }

  if (!detailed.length) return <div className="empty-state"><p>Your cart is empty. Add an object before checking out.</p></div>;
  return <form className="checkout-layout" onSubmit={submit}><div style={{ display: "grid", gap: "1rem" }}><section className="form-card"><h2>Contact</h2><div className="form-grid"><label className="field"><span>Name</span><input className="input" name="name" required minLength={2} autoComplete="name" /></label><label className="field"><span>Email</span><input className="input" name="email" required type="email" autoComplete="email" /></label><label className="field field-full"><span>Indian phone number</span><input className="input" name="phone" required inputMode="tel" pattern="(?:\+91)?[6-9][0-9]{9}" autoComplete="tel" placeholder="9876543210" /></label></div></section><section className="form-card"><h2>Delivery address</h2><div className="form-grid"><label className="field field-full"><span>Address line</span><input className="input" name="line1" required autoComplete="address-line1" /></label><label className="field field-full"><span>Apartment / building (optional)</span><input className="input" name="line2" autoComplete="address-line2" /></label><label className="field"><span>Locality</span><input className="input" name="locality" required /></label><label className="field"><span>City</span><input className="input" name="city" required autoComplete="address-level2" /></label><label className="field"><span>State</span><input className="input" name="state" required autoComplete="address-level1" /></label><label className="field"><span>Pincode</span><input className="input" name="pincode" required inputMode="numeric" pattern="[0-9]{6}" autoComplete="postal-code" /></label><label className="field field-full"><span>Landmark / delivery note (optional)</span><input className="input" name="landmark" /></label></div></section><section className="form-card"><label className="checkbox-row"><input type="checkbox" name="policyAccepted" required /> <span>I have reviewed the demo checkout notice and agree to the store policies. Live purchases remain disabled until business policies, shipping and tax settings are approved.</span></label></section>{message && <p className={`status-message ${state === "error" ? "error" : ""}`} role="status">{message}</p>}</div><aside className="summary-card"><h2>Review</h2>{detailed.map((line) => <div className="summary-row" key={line.variantId}><span>{line.product.name} × {line.quantity}</span><span>{formatINR(line.variant.pricePaise * line.quantity)}</span></div>)}<div className="summary-row"><span>Shipping</span><span>Server calculated</span></div><div className="summary-row"><span>Tax</span><span>Owner configuration</span></div><div className="summary-row summary-total"><span>Demo subtotal</span><span>{formatINR(estimatedSubtotal)}</span></div><p className="muted" style={{ fontSize: ".74rem" }}>The displayed subtotal is an estimate. The server ignores all client totals and reloads current variants, stock, rates and configuration.</p><button className="button button-accent" disabled={state === "creating" || state === "paying" || state === "verifying"} type="submit">{state === "creating" ? "Creating secure order…" : state === "verifying" ? "Verifying payment…" : "Continue to Razorpay"}</button></aside></form>;
}
