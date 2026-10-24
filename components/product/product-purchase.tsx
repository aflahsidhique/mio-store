"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatINR } from "@/lib/commerce/money";
import type { ProductVariant } from "@/lib/commerce/types";

export function ProductPurchase({ variants }: { variants: ProductVariant[] }) {
  const [selected, setSelected] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const current = variants.find((variant) => variant.id === selected) ?? variants[0];
  if (!current) return null;
  const available = current.madeToOrder || current.stock > 0;
  return <section aria-labelledby="choose-variant"><p id="choose-variant" className="field-label">Choose colour / finish</p><div className="variant-grid">{variants.map((variant) => <label className="variant-option" key={variant.id}><span><input type="radio" name="variant" value={variant.id} checked={selected === variant.id} onChange={() => { setSelected(variant.id); setAdded(false); }} /> {variant.name}</span><strong>{formatINR(variant.pricePaise)}</strong></label>)}</div><div className="purchase-row"><label className="field"><span className="field-label">Quantity</span><input className="input" type="number" min={1} max={20} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(20, Number(event.target.value))))} /></label><button className="button button-accent" type="button" disabled={!available} onClick={() => { add(current.id, quantity); setAdded(true); }}>{added ? <><Check size={18} /> Added to cart</> : available ? "Add to cart" : "Unavailable"}</button></div><p aria-live="polite" className="muted" style={{ fontSize: ".78rem" }}>{current.madeToOrder ? "Made to order. Production time will be confirmed before launch." : current.stock > 0 ? `${current.stock} demo units shown in seed inventory.` : "Currently unavailable."}</p></section>;
}
