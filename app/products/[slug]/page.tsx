import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/product/product-art";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPurchase } from "@/components/product/product-purchase";
import { loadProduct, loadProducts } from "@/lib/commerce/repository";
import { formatINR } from "@/lib/commerce/money";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  return product ? { title: product.name, description: product.shortDescription } : { title: "Product not found", robots: { index: false } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await loadProduct((await params).slug);
  if (!product) notFound();
  const price = Math.min(...product.variants.map((variant) => variant.pricePaise));
  const related = (await loadProducts()).filter((candidate) => candidate.id !== product.id && candidate.categorySlug === product.categorySlug).slice(0, 4);
  return <><div className="shell product-detail"><section className="product-gallery" aria-label="Product imagery"><ProductArt product={product} /></section><section className="product-summary"><p className="eyebrow">{product.eyebrow}</p><h1>{product.name}</h1><p className="price">From {formatINR(price)}</p><p className="lede">{product.shortDescription}</p><p className="muted">{product.description}</p><ProductPurchase variants={product.variants} /><dl className="detail-list"><div className="detail-row"><dt>Material</dt><dd>{product.material}</dd></div><div className="detail-row"><dt>Dimensions</dt><dd>{product.dimensions}</dd></div><div className="detail-row"><dt>In the box</dt><dd>{product.included}</dd></div><div className="detail-row"><dt>Care</dt><dd>{product.care}</dd></div><div className="detail-row"><dt>Good to know</dt><dd>{product.limitation}</dd></div><div className="detail-row"><dt>Dispatch</dt><dd>{product.leadTime}</dd></div></dl><p className="muted" style={{ fontSize: ".8rem" }}>Shipping rates and delivery estimates appear at checkout only after provider configuration. See our <Link className="text-link" href="/policies/shipping">shipping policy</Link>.</p></section></div>{related.length > 0 && <section className="shell section"><div className="split-heading"><div><p className="eyebrow">Continue exploring</p><h2 className="section-title">Related objects.</h2></div></div><ProductGrid products={related} /></section>}</>;
}
