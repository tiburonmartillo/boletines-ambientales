/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/boletines-ambientales',
  assetPrefix: '/boletines-ambientales/',
}

export default nextConfig
