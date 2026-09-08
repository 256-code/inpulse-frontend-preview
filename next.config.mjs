/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/inpulse-frontend-preview',
  images: {
    unoptimized: true,
  },
  devIndicators: false,
}

export default nextConfig