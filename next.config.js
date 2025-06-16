/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];
    return config;
  },
};

module.exports = nextConfig;