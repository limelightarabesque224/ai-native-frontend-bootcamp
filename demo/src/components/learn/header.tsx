'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <Link href="/learn" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            AI
          </span>
          <div>
            <div className="font-semibold text-sm">大模型时代的前端开发</div>
            <div className="text-xs text-muted-foreground">科大讯飞 · 前端中级训练营</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Demo 演示
          </Link>
          <Link
            href="/learn"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            课程学习
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
