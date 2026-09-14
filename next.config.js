/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const isStaticExport = isGithubPages || process.env.STATIC_EXPORT === 'true';

const nextConfig = {
  ...(isStaticExport && { output: 'export' }),
  basePath: isGithubPages ? '/glitter-game-day' : '',
  assetPrefix: isGithubPages ? '/glitter-game-day/' : '',
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.etsystatic.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
};

module.exports = nextConfig;
