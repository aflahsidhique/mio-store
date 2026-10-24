import Link from "next/link";
import { ProductArt } from "./product-art";
import { formatINR } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";

export function ProductCard({ product }: { product: Product }) {
  const price = Math.min(...product.variants.map((variant) => variant.pricePaise));
  return <article className="product-card"><Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}><ProductArt product={product} /></Link><div className="product-info"><div className="product-meta"><h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3><span className="product-price">{formatINR(price)}</span></div><p>{product.category} · {product.type === "made_to_order" ? "Made to order" : "Demo stock"}</p></div></article>;
}
