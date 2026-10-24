import { capabilities } from "@/lib/config";
import { supabaseRequest } from "@/lib/db/supabase-rest";
import { demoProducts, getProduct as getDemoProduct } from "./catalog";
import type { Product } from "./types";

type ProductRow = {
  id: string; slug: string; name: string; short_description: string; description: string; kind: Product["type"];
  state: Product["status"]; featured: boolean; material: string | null; dimensions: string | null; included: string | null;
  care: string | null; lead_time: string | null; limitations: string | null; categories: { name: string; slug: string } | null;
  product_variants: Array<{ id: string; sku: string; name: string; options: Record<string, string>; price_paise: number; compare_at_paise: number | null; stock_quantity: number; made_to_order: boolean }>;
};

const palettes: Product["palette"][] = [["#ee5a36","#f4a68c","#30312d"],["#6b8670","#d7dfd2","#1f2922"],["#d7b665","#f1e2b8","#3b3321"],["#8f6b8f","#dfccdf","#342735"]];
const shapes: Product["shape"][] = ["wave","loop","arch","stack"];

function mapRow(row: ProductRow, index: number): Product {
  return {
    id: row.id, slug: row.slug, name: row.name, eyebrow: row.categories ? `Collection · ${row.categories.name}` : "MIO Studio",
    shortDescription: row.short_description, description: row.description, type: row.kind, status: row.state,
    category: row.categories?.name ?? "Objects", categorySlug: row.categories?.slug ?? "objects", featured: row.featured,
    material: row.material ?? "Material details pending", dimensions: row.dimensions ?? "Dimensions pending", included: row.included ?? "Inclusions pending",
    care: row.care ?? "Care details pending", leadTime: row.lead_time ?? "Lead time pending", limitation: row.limitations ?? "Production details pending",
    palette: palettes[index % palettes.length], shape: shapes[index % shapes.length],
    variants: row.product_variants.map((variant) => ({ id: variant.id, sku: variant.sku, name: variant.name, colour: variant.options.colour ?? variant.name, finish: variant.options.finish ?? "Standard", pricePaise: variant.price_paise, compareAtPaise: variant.compare_at_paise ?? undefined, stock: variant.stock_quantity, madeToOrder: variant.made_to_order })),
  };
}

export async function loadProducts(): Promise<Product[]> {
  if (!capabilities.publicCatalog) return demoProducts;
  try {
    const rows = await supabaseRequest<ProductRow[]>("/rest/v1/products?select=id,slug,name,short_description,description,kind,state,featured,material,dimensions,included,care,lead_time,limitations,categories(name,slug),product_variants(id,sku,name,options,price_paise,compare_at_paise,stock_quantity,made_to_order)&state=eq.published&order=created_at.desc", {}, "public");
    return rows.length ? rows.map(mapRow) : [];
  } catch { return demoProducts; }
}

export async function loadProduct(slug: string) {
  if (!capabilities.publicCatalog) return getDemoProduct(slug);
  try {
    const rows = await supabaseRequest<ProductRow[]>(`/rest/v1/products?select=id,slug,name,short_description,description,kind,state,featured,material,dimensions,included,care,lead_time,limitations,categories(name,slug),product_variants(id,sku,name,options,price_paise,compare_at_paise,stock_quantity,made_to_order)&state=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`, {}, "public");
    return rows[0] ? mapRow(rows[0], 0) : undefined;
  } catch { return getDemoProduct(slug); }
}
