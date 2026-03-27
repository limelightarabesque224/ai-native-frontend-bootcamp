'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { lessons } from '@/lib/lessons'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-secondary/30 overflow-y-auto h-[calc(100vh-64px)] sticky top-16">
      <nav className="p-4 space-y-1">
        <Link
          href="/learn"
          className={cn(
            'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/learn'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          )}
        >
          课程总览
        </Link>

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
    </aside>
  )
}
