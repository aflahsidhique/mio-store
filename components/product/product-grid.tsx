import { ProductCard } from "./product-card";
import type { Product } from "@/lib/commerce/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="empty-state"><div><h2>No objects here yet.</h2><p className="muted">Try another category or search term.</p></div></div>;
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
