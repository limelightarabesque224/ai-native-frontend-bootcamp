'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { lessons } from '@/lib/lessons'
import { useMobileNav } from './mobile-nav-context'

function SidebarContent() {
  const pathname = usePathname()
  const { close } = useMobileNav()

  return (
    <nav className="p-4 space-y-1">
      <Link
        href="/learn"
        onClick={close}
        className={cn(
          'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
          pathname === '/learn'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )}
      >
        课程总览
      </Link>

      {/* 移动端额外导航链接 */}
      <div className="md:hidden pt-2 pb-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        导航
      </div>
      <Link
        href="/"
        onClick={close}
        className="md:hidden block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        Demo 演示
      </Link>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        GitHub
      </a>

      <div className="pt-2 pb-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        课程目录
      </div>

      {lessons.map((lesson) => {
        const href = `/learn/${lesson.id}`
        const isActive = pathname === href

        return (
          <Link
            key={lesson.id}
            href={href}
            onClick={close}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold',
                isActive
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {lesson.number}
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">{lesson.title}</div>
              <div className="truncate text-xs opacity-70">{lesson.subtitle}</div>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const { isOpen, close } = useMobileNav()

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 top-14 z-40 bg-black/50"
          onClick={close}
          onKeyDown={(e) => e.key === 'Escape' && close()}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          // 移动端：抽屉式侧边栏
          'fixed top-14 left-0 z-40 h-[calc(100vh-56px)] w-72 bg-background border-r border-border overflow-y-auto transition-transform duration-200 ease-in-out',
          'md:sticky md:top-16 md:h-[calc(100vh-64px)] md:z-0 md:translate-x-0 md:bg-secondary/30',
          // 移动端默认隐藏
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          // 桌面端收缩
          'shrink-0'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
