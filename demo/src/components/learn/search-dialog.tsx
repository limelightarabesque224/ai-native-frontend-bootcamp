'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { LessonSearchEntry } from '@/lib/lesson-search'
import { getHighlightParts, searchLessons } from '@/lib/lesson-search'

interface SearchDialogProps {
  searchEntries: LessonSearchEntry[]
}

function HighlightedText({
  text,
  query,
}: {
  text: string
  query: string
}) {
  return getHighlightParts(text, query).map((part, index) =>
    part.highlighted ? (
      <mark
        key={`${part.text}-${index}`}
        className="rounded bg-yellow-300/70 px-0.5 text-inherit"
      >
        {part.text}
      </mark>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    )
  )
}

export function SearchDialog({ searchEntries }: SearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const results = useMemo(
    () => searchLessons(query, searchEntries),
    [query, searchEntries]
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // 键盘快捷键 ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 对话框内键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(
            (prev) =>
              (prev - 1 + Math.max(results.length, 1)) %
              Math.max(results.length, 1)
          )
          break
        case 'Enter':
          if (results[selectedIndex]) {
            setOpen(false)
            window.location.href = `/learn/${results[selectedIndex].id}`
          }
          break
      }
    },
    [results, selectedIndex]
  )

  const handleClose = () => {
    setOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">搜索课程...</span>
          <kbd className="border-border bg-background text-muted-foreground hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-xs md:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          className="border-border bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border shadow-2xl"
          onKeyDown={handleKeyDown}
        >
          <div className="border-border flex items-center gap-3 border-b px-4 py-3">
            <Search className="text-muted-foreground h-5 w-5" />
            <input
              type="text"
              placeholder="搜索课程、正文细节或标签..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="placeholder:text-muted-foreground flex-1 bg-transparent text-base outline-none"
              autoFocus
            />
            <Dialog.Close asChild>
              <button
                type="button"
                className="hover:bg-secondary rounded-md p-1 transition-colors"
                onClick={handleClose}
              >
                <X className="text-muted-foreground h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {query && results.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
                <Search className="mb-3 h-10 w-10 opacity-50" />
                <p className="text-sm">未找到匹配的课程</p>
                <p className="mt-1 text-xs">尝试其他关键词</p>
              </div>
            ) : results.length > 0 ? (
              <ul className="space-y-1">
                {results.map((result, index) => (
                  <li key={result.id}>
                    <Link
                      href={`/learn/${result.id}`}
                      onClick={handleClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                        index === selectedIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                          index === selectedIndex
                            ? 'bg-primary-foreground/20'
                            : 'bg-secondary'
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          第{result.number}课 ·{' '}
                          <HighlightedText text={result.title} query={query} />
                        </div>
                        <div
                          className={`truncate text-xs ${
                            index === selectedIndex
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          <HighlightedText
                            text={
                              result.matchType === 'content'
                                ? result.matchedText
                                : result.subtitle
                            }
                            query={query}
                          />
                          {result.matchType === 'tag' && (
                            <span className="bg-primary/10 ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs">
                              #
                              <HighlightedText
                                text={result.matchedText}
                                query={query}
                              />
                            </span>
                          )}
                          {result.matchType === 'content' && (
                            <span className="bg-primary/10 ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs">
                              正文命中
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 shrink-0 ${
                          index === selectedIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6">
                <p className="text-muted-foreground mb-4 text-center text-xs">
                  快速跳转
                </p>
                <ul className="space-y-1">
                  {searchEntries.slice(0, 5).map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/learn/${lesson.id}`}
                        onClick={handleClose}
                        className="text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                      >
                        <span className="bg-secondary flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-medium">
                          {lesson.number}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="border-border text-muted-foreground flex items-center justify-between border-t px-4 py-2.5 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="border-border bg-secondary rounded border px-1.5 py-0.5">
                  ↑
                </kbd>
                <kbd className="border-border bg-secondary rounded border px-1.5 py-0.5">
                  ↓
                </kbd>
                <span>导航</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border-border bg-secondary rounded border px-1.5 py-0.5">
                  ↵
                </kbd>
                <span>打开</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="border-border bg-secondary rounded border px-1.5 py-0.5">
                esc
              </kbd>
              <span>关闭</span>
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
