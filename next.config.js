/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  ...(isGithubPages && { output: 'export' }),
  basePath: isGithubPages ? '/glitter-game-day' : '',
  assetPrefix: isGithubPages ? '/glitter-game-day/' : '',
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.etsystatic.com',
      },
    ],
  },
};

module.exports = nextConfig;
