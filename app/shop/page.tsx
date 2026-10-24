import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/shop/catalog-browser";
import { DEMO_NOTICE } from "@/lib/commerce/catalog";
import { loadProducts } from "@/lib/commerce/repository";

export const metadata: Metadata = { title: "Shop", description: "Browse MIO Studio's demo collection of thoughtful 3D-printed objects." };

export default async function ShopPage() {
  const products = await loadProducts();
  return <div className="shell"><header className="page-hero"><p className="eyebrow">The collection</p><h1 className="page-title">Small objects.<br />Big intention.</h1><p className="lede">Explore functional, expressive forms for desks, homes and everyday routines.</p><p className="status-message" style={{ marginTop: "1.5rem" }}>{DEMO_NOTICE}</p></header><section className="section-tight" style={{ paddingTop: 0 }}><CatalogBrowser products={products} /></section></div>;
}
