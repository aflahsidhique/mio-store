import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { loadProducts } from "@/lib/commerce/repository";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const products = await loadProducts();
  const category = products.find((item) => item.categorySlug === slug)?.category;
  return { title: category ?? "Collection", robots: category ? undefined : { index: false } };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allProducts = await loadProducts();
  const products = allProducts.filter((product) => product.categorySlug === slug);
  if (!products.length) notFound();
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Collection</p><h1 className="page-title">{products[0].category}</h1><p className="lede">A focused edit from the MIO Studio catalogue.</p></header><section className="section-tight" style={{ paddingTop: 0 }}><ProductGrid products={products} /></section></div>;
}
