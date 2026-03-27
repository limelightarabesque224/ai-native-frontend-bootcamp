import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '大模型时代的前端开发 - Demo',
  description: 'AI-Native 前端技术栈演示项目',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
