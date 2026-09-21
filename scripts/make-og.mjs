/**
 * Regenerates public/og-image.png from an inline SVG.
 * Run: node scripts/make-og.mjs
 * Falls back to writing an SVG if sharp is not installed.
 */
import { writeFileSync } from "node:fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a0020"/>
      <stop offset="50%" stop-color="#000820"/>
      <stop offset="100%" stop-color="#1a0020"/>
    </linearGradient>
    <linearGradient id="txt" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f472b6"/>
      <stop offset="50%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="290" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="96" font-weight="800" fill="#ffffff">Glitter</text>
  <text x="600" y="400" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="96" font-weight="800" fill="url(#txt)">Game Day</text>
  <text x="600" y="470" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="30" fill="#ffffff" opacity="0.6">Women's sequin game day jerseys</text>
</svg>`;

try {
  const { default: sharp } = await import("sharp");
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(new URL("../public/og-image.png", import.meta.url), png);
  console.log("wrote public/og-image.png");
} catch {
  writeFileSync(new URL("../public/og-image.svg", import.meta.url), svg);
  console.log("sharp not installed; wrote public/og-image.svg instead");
}
