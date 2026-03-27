import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // basePath: '/ai-native-frontend-bootcamp', // 本地开发时注释掉
  images: {
    unoptimized: true,
  },
}

export default nextConfig
