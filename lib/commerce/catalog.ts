import type { Product } from "./types";

export const DEMO_NOTICE =
  "Illustrative demo catalogue — products, availability and prices require owner approval before launch.";

export const demoProducts: Product[] = [
  {
    id: "demo-arc-desk-tray",
    slug: "arc-desk-tray",
    name: "Arc desk tray",
    eyebrow: "Demo · Desk objects",
    shortDescription: "A calm landing place for the small things that otherwise wander.",
    description:
      "An expressive desktop organiser with a softly stepped profile. Designed as an illustrative product to demonstrate MIO Studio's catalogue and variant system.",
    type: "made_to_order",
    status: "published",
    category: "Desk objects",
    categorySlug: "desk-objects",
    featured: true,
    material: "Demo material: PLA (confirm before launch)",
    dimensions: "Demo size: 180 × 92 × 24 mm",
    leadTime: "Lead time to be confirmed",
    care: "Keep away from high heat; wipe with a soft damp cloth.",
    included: "One illustrative tray",
    limitation: "Layer lines and minor tonal variation are natural to the printing process.",
    palette: ["#ee5a36", "#f4a68c", "#30312d"],
    shape: "wave",
    variants: [
      { id: "demo-arc-clay", sku: "DEMO-ARC-CLAY", name: "Clay orange", colour: "Clay orange", finish: "Matte", pricePaise: 74900, stock: 0, madeToOrder: true },
      { id: "demo-arc-charcoal", sku: "DEMO-ARC-CHARCOAL", name: "Charcoal", colour: "Charcoal", finish: "Matte", pricePaise: 74900, stock: 0, madeToOrder: true },
    ],
  },
  {
    id: "demo-orbit-cable-rest",
    slug: "orbit-cable-rest",
    name: "Orbit cable rest",
    eyebrow: "Demo · Practical parts",
    shortDescription: "A compact cable keeper with a satisfying, sculptural loop.",
    description:
      "A small functional print that keeps charging cables within reach. This seed item is for interface testing only and is not an approved MIO Studio product.",
    type: "physical",
    status: "published",
    category: "Practical parts",
    categorySlug: "practical-parts",
    featured: true,
    material: "Demo material: PLA+ (confirm before launch)",
    dimensions: "Demo size: 54 × 42 × 28 mm",
    leadTime: "Dispatch estimate to be configured",
    care: "Indoor use only; avoid prolonged direct sunlight.",
    included: "Set of two illustrative cable rests",
    limitation: "Fit depends on cable diameter; exact compatibility is not yet verified.",
    palette: ["#6b8670", "#d7dfd2", "#1f2922"],
    shape: "loop",
    variants: [
      { id: "demo-orbit-sage", sku: "DEMO-ORB-SAGE", name: "Sage", colour: "Sage", finish: "Soft matte", pricePaise: 29900, stock: 12 },
      { id: "demo-orbit-sand", sku: "DEMO-ORB-SAND", name: "Sand", colour: "Sand", finish: "Soft matte", pricePaise: 29900, stock: 8 },
    ],
  },
  {
    id: "demo-nook-stand",
    slug: "nook-phone-stand",
    name: "Nook phone stand",
    eyebrow: "Demo · Desk objects",
    shortDescription: "A compact stand shaped for unhurried, hands-free moments.",
    description:
      "A folded silhouette with a broad base and considered viewing angle. Device fit and load limits must be validated before this demo concept becomes a product.",
    type: "physical",
    status: "published",
    category: "Desk objects",
    categorySlug: "desk-objects",
    featured: true,
    material: "Demo material: PLA (confirm before launch)",
    dimensions: "Demo size: 84 × 76 × 112 mm",
    leadTime: "Dispatch estimate to be configured",
    care: "Use on a level surface; avoid high-temperature environments.",
    included: "One illustrative stand",
    limitation: "Large cases may affect fit; compatibility is not guaranteed.",
    palette: ["#d7b665", "#f1e2b8", "#3b3321"],
    shape: "arch",
    variants: [
      { id: "demo-nook-mustard", sku: "DEMO-NOOK-MUS", name: "Mustard", colour: "Mustard", finish: "Matte", pricePaise: 54900, stock: 5 },
      { id: "demo-nook-coral", sku: "DEMO-NOOK-COR", name: "Coral", colour: "Coral", finish: "Matte", pricePaise: 54900, stock: 4 },
    ],
  },
  {
    id: "demo-stack-planter",
    slug: "stack-mini-planter",
    name: "Stack mini planter",
    eyebrow: "Demo · Home objects",
    shortDescription: "A layered little vessel for cuttings, pencils, or tiny keepsakes.",
    description:
      "An illustrative ribbed vessel that makes the layer-by-layer process visible. It is not certified food-safe or watertight and requires an inner pot for plants.",
    type: "made_to_order",
    status: "published",
    category: "Home objects",
    categorySlug: "home-objects",
    featured: false,
    material: "Demo material: PLA (confirm before launch)",
    dimensions: "Demo size: 88 × 88 × 96 mm",
    leadTime: "Lead time to be confirmed",
    care: "Use a liner; do not expose directly to water or heat.",
    included: "One illustrative outer planter",
    limitation: "Not watertight or food-safe. Plant and liner are not included.",
    palette: ["#8f6b8f", "#dfccdf", "#342735"],
    shape: "stack",
    variants: [
      { id: "demo-stack-plum", sku: "DEMO-STK-PLM", name: "Dusty plum", colour: "Dusty plum", finish: "Layered matte", pricePaise: 64900, stock: 0, madeToOrder: true },
    ],
  },
];

export function getProduct(slug: string) {
  return demoProducts.find((product) => product.slug === slug);
}

export function getVariant(variantId: string) {
  for (const product of demoProducts) {
    const variant = product.variants.find((candidate) => candidate.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
}

export const demoCategories = Array.from(
  new Map(demoProducts.map((product) => [product.categorySlug, product.category])).entries(),
).map(([slug, name]) => ({
  slug,
  name,
  count: demoProducts.filter((product) => product.categorySlug === slug).length,
}));
