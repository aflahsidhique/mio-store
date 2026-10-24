import type { Product } from "@/lib/commerce/types";

export function ProductArt({ product, className = "" }: { product: Product; className?: string }) {
  return <div className={`product-art ${product.shape} ${className}`} role="img" aria-label={`Illustrative placeholder for ${product.name}`} style={{ "--art-a": product.palette[0], "--art-b": product.palette[1], "--art-c": product.palette[2] } as React.CSSProperties} />;
}
