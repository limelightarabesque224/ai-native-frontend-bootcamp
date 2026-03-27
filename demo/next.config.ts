import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ai-native-frontend-bootcamp',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
