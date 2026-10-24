"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";
import { ProductArt } from "@/components/product/product-art";
import { formatINR } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";

export function CartPage({ products }: { products: Product[] }) {
  const { lines, hydrated, update, remove } = useCart();
  const detailed = lines.flatMap((line) => { const product = products.find((candidate) => candidate.variants.some((variant) => variant.id === line.variantId)); const variant = product?.variants.find((candidate) => candidate.id === line.variantId); return product && variant ? [{ ...line, product, variant }] : []; });
  const subtotal = detailed.reduce((sum, line) => sum + line.variant.pricePaise * line.quantity, 0);
  if (!hydrated) return <div className="empty-state"><p>Loading your cart…</p></div>;
  if (!detailed.length) return <div className="empty-state"><div><p className="eyebrow">Your cart</p><h2>There’s room for a good idea.</h2><p className="muted">Browse the demo collection and choose an object to continue.</p><Link className="button button-primary" href="/shop">Explore the collection</Link></div></div>;
  return <div className="cart-layout"><section aria-label="Cart items">{detailed.map((line) => <article className="cart-line" key={line.variantId}><Link href={`/products/${line.product.slug}`}><ProductArt product={line.product} className="cart-thumb" /></Link><div><h2><Link href={`/products/${line.product.slug}`}>{line.product.name}</Link></h2><p>{line.variant.name} · {line.variant.sku}</p><strong>{formatINR(line.variant.pricePaise)}</strong><div className="cart-controls"><label><span className="field-label" style={{ marginRight: ".4rem" }}>Qty</span><input className="quantity-input" aria-label={`Quantity for ${line.product.name}`} type="number" min={1} max={20} value={line.quantity} onChange={(event) => update(line.variantId, Number(event.target.value))} /></label><button className="icon-link" type="button" aria-label={`Remove ${line.product.name}`} onClick={() => remove(line.variantId)}><Trash2 size={16} /></button></div></div><strong>{formatINR(line.variant.pricePaise * line.quantity)}</strong></article>)}</section><aside className="summary-card"><h2>Order summary</h2><div className="summary-row"><span>Items</span><span>{formatINR(subtotal)}</span></div><div className="summary-row"><span>Shipping</span><span>Calculated securely</span></div><div className="summary-row"><span>Tax</span><span>Not configured</span></div><div className="summary-row summary-total"><span>Estimated subtotal</span><span>{formatINR(subtotal)}</span></div><p className="muted" style={{ fontSize: ".75rem" }}>Final prices, stock, shipping and taxes are reloaded and calculated by the server before payment.</p><Link className="button button-accent" href="/checkout">Continue to checkout</Link></aside></div>;
}
