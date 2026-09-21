/**
 * Central site configuration.
 *
 * DEPLOYMENT NOTE
 * There are two ways this site can be served and they need different values:
 *
 *  1. GitHub Pages project URL: https://albertrus.github.io/glitter-game-day
 *     The site lives under a subdirectory, so every asset and link needs the
 *     /glitter-game-day prefix.
 *     Build with:  GITHUB_PAGES=true npm run build
 *
 *  2. A custom domain (glittergameday.com) pointed at GitHub Pages via a
 *     CNAME file. The site is then served from the ROOT, so there must be NO
 *     path prefix. Setting one produces 404s on every asset.
 *     Build with:  NEXT_PUBLIC_SITE_URL=https://glittergameday.com npm run build
 *
 * Setting NEXT_PUBLIC_SITE_URL is what switches off the subdirectory prefix,
 * so the two can never drift apart and emit canonical URLs that do not exist.
 */

const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

/** True only when serving from the GitHub Pages project subdirectory. */
const usingProjectSubpath =
  process.env.GITHUB_PAGES === "true" && !explicitSiteUrl;

export const BASE_PATH = usingProjectSubpath ? "/glitter-game-day" : "";

export const SITE_URL =
  explicitSiteUrl ||
  (usingProjectSubpath
    ? "https://albertrus.github.io"
    : "https://glittergameday.com");

export const ETSY_SHOP_URL = "https://www.etsy.com/shop/GlitterGameDay";

/**
 * GA4 measurement ID. Set NEXT_PUBLIC_GA_ID to enable analytics.
 * If unset, no analytics script is emitted at all.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/**
 * Next rewrites <Image src> and <Link href> for basePath automatically, but
 * NOT strings inside metadata or JSON-LD. Use these for those.
 */
export function asset(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}

export function absoluteUrl(path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${BASE_PATH}${clean}`;
}
