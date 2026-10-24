"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function SiteHeader() {
  const { count } = useCart();
  return <><div className="demo-notice">Development preview · Catalogue details and prices are illustrative until approved</div><header className="site-header"><nav className="nav shell" aria-label="Primary navigation"><Link className="brand" href="/" aria-label="MIO Studio home"><span className="brand-mark" aria-hidden="true" />MIO Studio</Link><div className="nav-links"><Link href="/shop">Shop</Link><Link href="/custom-3d-printing">Custom printing</Link><Link href="/about">About</Link><Link href="/track-order">Track order</Link></div><div className="nav-actions"><Link className="icon-link" href="/search" aria-label="Search"><Search size={18} /></Link><Link className="icon-link" href="/account" aria-label="Account"><UserRound size={18} /></Link><Link className="icon-link" href="/cart" aria-label={`Cart with ${count} items`}><ShoppingBag size={18} />{count > 0 && <span className="cart-count">{count}</span>}</Link><details className="mobile-nav"><summary className="icon-link" aria-label="Open menu"><Menu size={20} /></summary><div className="mobile-menu"><Link href="/shop">Shop</Link><Link href="/custom-3d-printing">Custom printing</Link><Link href="/about">About</Link><Link href="/track-order">Track order</Link><Link href="/contact">Contact</Link></div></details></div></nav></header></>;
}
