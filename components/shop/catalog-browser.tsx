"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/commerce/types";

export function CatalogBrowser({ products, initialQuery = "", initialCategory = "all" }: { products: Product[]; initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const categories = useMemo(() => Array.from(new Map(products.map((product) => [product.categorySlug, product.category])).entries()).map(([slug, name]) => ({ slug, name })), [products]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => (category === "all" || product.categorySlug === category) && (!normalized || `${product.name} ${product.shortDescription} ${product.category} ${product.material}`.toLowerCase().includes(normalized)));
    return [...result].sort((a, b) => {
      const aPrice = Math.min(...a.variants.map((variant) => variant.pricePaise));
      const bPrice = Math.min(...b.variants.map((variant) => variant.pricePaise));
      if (sort === "price-asc") return aPrice - bPrice;
      if (sort === "price-desc") return bPrice - aPrice;
      if (sort === "newest") return b.id.localeCompare(a.id);
      return Number(b.featured) - Number(a.featured);
    });
  }, [products, query, category, sort]);
  return <><div className="toolbar"><div className="filter-row" aria-label="Product categories"><button type="button" className={`filter-chip ${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")}>All</button>{categories.map((item) => <button type="button" className={`filter-chip ${category === item.slug ? "active" : ""}`} onClick={() => setCategory(item.slug)} key={item.slug}>{item.name}</button>)}</div><select className="select" aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div><label className="field" style={{ marginBottom: "2rem", maxWidth: 520 }}><span className="field-label">Search the catalogue</span><input className="input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tray, desk, planter…" /></label><p className="muted" aria-live="polite" style={{ fontSize: ".8rem" }}>{filtered.length} {filtered.length === 1 ? "object" : "objects"}</p><ProductGrid products={filtered} /></>;
}
