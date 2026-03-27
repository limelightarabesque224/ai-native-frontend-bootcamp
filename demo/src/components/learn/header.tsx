'use client'

import Link from 'next/link'
import { useMobileNav } from './mobile-nav-context'

export function Header() {
  const { isOpen, toggle } = useMobileNav()

  return (
    <header className="h-14 md:h-16 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* 移动端汉堡菜单按钮 */}
          <button
            type="button"
            onClick={toggle}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-secondary transition-colors"
            aria-label={isOpen ? '关闭菜单' : '打开菜单'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="text-foreground"
            >
              {isOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="4" x2="4" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="3" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>

          <Link href="/learn" className="flex items-center gap-2 md:gap-3">
            <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs md:text-sm font-bold">
              AI
            </span>
            <div>
              <div className="font-semibold text-sm">大模型时代的前端开发</div>
              <div className="text-xs text-muted-foreground hidden sm:block">科大讯飞 · 前端中级训练营</div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-4">
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
