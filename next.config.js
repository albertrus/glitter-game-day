/** @type {import('next').NextConfig} */

// Keep this logic in sync with lib/site.ts.
const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const usingProjectSubpath =
  process.env.GITHUB_PAGES === 'true' && !explicitSiteUrl;

const isStaticExport =
  process.env.GITHUB_PAGES === 'true' || process.env.STATIC_EXPORT === 'true';

const nextConfig = {
  ...(isStaticExport && { output: 'export' }),
  basePath: usingProjectSubpath ? '/glitter-game-day' : '',
  assetPrefix: usingProjectSubpath ? '/glitter-game-day/' : '',
  trailingSlash: false,
  images: {
    // GitHub Pages has no image optimizer, so the static export must ship
    // unoptimized images.
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.etsystatic.com' },
      { protocol: 'https', hostname: '*.etsystatic.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
};

module.exports = nextConfig;
