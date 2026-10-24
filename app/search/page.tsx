import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/shop/catalog-browser";
import { loadProducts } from "@/lib/commerce/repository";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = await loadProducts();
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Search</p><h1 className="page-title">Find your object.</h1><p className="lede">Search by name, purpose, category or material.</p></header><section className="section-tight" style={{ paddingTop: 0 }}><CatalogBrowser products={products} initialQuery={q} /></section></div>;
}
