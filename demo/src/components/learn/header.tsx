'use client'

import Link from 'next/link'
import type { LessonSearchEntry } from '@/lib/lesson-search'
import { useMobileNav } from './mobile-nav-context'
import { SearchDialog } from './search-dialog'

interface HeaderProps {
  searchEntries: LessonSearchEntry[]
}

export function Header({ searchEntries }: HeaderProps) {
  const { isOpen, toggle } = useMobileNav()

  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 h-14 border-b backdrop-blur md:h-16">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* 移动端汉堡菜单按钮 */}
          <button
            type="button"
            onClick={toggle}
            className="hover:bg-secondary flex h-8 w-8 items-center justify-center rounded-md transition-colors md:hidden"
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
                  <line
                    x1="4"
                    y1="4"
                    x2="14"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="14"
                    y1="4"
                    x2="4"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <>
                  <line
                    x1="3"
                    y1="5"
                    x2="15"
                    y2="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="9"
                    x2="15"
                    y2="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="13"
                    x2="15"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>

          <Link href="/learn" className="flex items-center gap-2 md:gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop
                    offset="0%"
                    style={{ stopColor: '#3b82f6', stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: '#8b5cf6', stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                d="M 10 12 L 6 16 L 10 20"
                stroke="url(#grad)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 22 12 L 26 16 L 22 20"
                stroke="url(#grad)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 16 9 L 14 16 L 18 16 L 16 23"
                stroke="url(#grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div>
              <div className="text-sm font-semibold">大模型时代的前端开发</div>
              <div className="text-muted-foreground hidden text-xs sm:block">
                AI-Native 前端训练营 · @trsoliu
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <SearchDialog searchEntries={searchEntries} />

          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Demo 演示
            </Link>
            <Link
              href="/learn"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              课程学习
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
