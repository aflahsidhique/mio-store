import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";
import { loadProducts } from "@/lib/commerce/repository";

export const metadata: Metadata = { title: "Cart", robots: { index: false, follow: false } };

export default async function CartRoute() {
  const products = await loadProducts();
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Your selection</p><h1 className="page-title">Cart.</h1></header><section className="section-tight" style={{ paddingTop: 0 }}><CartPage products={products} /></section></div>;
}
