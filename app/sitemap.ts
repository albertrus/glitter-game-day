import { MetadataRoute } from "next";
import { teams } from "@/data/teams";
import { products } from "@/data/products";
import { absoluteUrl } from "@/lib/site";

/**
 * Previously this emitted fragment URLs (/#astros). Google treats a fragment
 * as the same page as the root, so those entries were duplicates and carried
 * no value. Every entry below is now a distinct, crawlable route.
 * Policy pages are intentionally excluded while they are unfinished.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...teams.map((team) => ({
      url: absoluteUrl(`/collections/${team.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/sizing"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/care"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
