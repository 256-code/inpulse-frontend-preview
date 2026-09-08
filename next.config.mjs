/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/v1.0',
  images: {
    unoptimized: true,
  },
  devIndicators: false,
}

export default nextConfig