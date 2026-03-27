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
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <path d="M 10 12 L 6 16 L 10 20" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M 22 12 L 26 16 L 22 20" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M 16 9 L 14 16 L 18 16 L 16 23" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
            <div>
              <div className="font-semibold text-sm">大模型时代的前端开发</div>
              <div className="text-xs text-muted-foreground hidden sm:block">AI-Native 前端训练营</div>
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
