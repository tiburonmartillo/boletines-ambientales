/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removido output: 'export' para permitir API routes en Vercel
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.devtool = false;
    }
    return config;
  },
}

export default nextConfig
