import type { MetadataRoute } from "next";
import { demoCategories, demoProducts } from "@/lib/commerce/catalog";
import { config } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/shop", "/custom-3d-printing", "/about", "/contact", "/faq", "/policies/shipping", "/policies/returns-refunds", "/policies/cancellation", "/policies/privacy", "/policies/terms"];
  return [...paths, ...demoProducts.map((item) => `/products/${item.slug}`), ...demoCategories.map((item) => `/collections/${item.slug}`)].map((path) => ({ url: `${config.siteUrl}${path}`, lastModified: new Date(), changeFrequency: path.includes("products") ? "weekly" : "monthly" }));
}
