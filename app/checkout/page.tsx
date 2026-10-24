import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { loadProducts } from "@/lib/commerce/repository";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default async function CheckoutPage() {
  const products = await loadProducts();
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Secure checkout</p><h1 className="page-title">Where should it go?</h1><p className="lede">Your final amount is always recalculated on the server before Razorpay opens.</p></header><section className="section-tight" style={{ paddingTop: 0 }}><CheckoutForm products={products} /></section></div>;
}
