import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // 只在生产环境（GitHub Pages）使用 basePath
  basePath: process.env.NODE_ENV === 'production' ? '/ai-native-frontend-bootcamp' : '',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
