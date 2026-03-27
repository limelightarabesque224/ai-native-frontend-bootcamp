'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState, useEffect } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

function generateToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const toc: TocItem[] = []
  let match: RegExpExecArray | null = headingRegex.exec(content)

  while (match !== null) {
    const level = match[1].length
    const text = match[2].replace(/[`*_~]/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-|-$/g, '')

    if (level <= 3) {
      toc.push({ id, text, level })
    }
    match = headingRegex.exec(content)
  }
  return toc
}

function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    for (const item of toc) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  return (
    <nav className="hidden xl:block fixed right-8 top-24 w-56 max-h-[calc(100vh-120px)] overflow-y-auto text-sm">
      <div className="font-medium text-muted-foreground mb-3 text-xs uppercase tracking-wider">
        目录
      </div>
      <ul className="space-y-1">
        {toc
          .filter((item) => item.level <= 2)
          .map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block py-1 transition-colors border-l-2 ${
                  item.level === 1 ? 'pl-3' : 'pl-5'
                } ${
                  activeId === item.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {item.text.length > 30 ? `${item.text.slice(0, 30)}...` : item.text}
              </a>
            </li>
          ))}
      </ul>
    </nav>
  )
}

export function LessonContent({ content }: { content: string }) {
  const toc = generateToc(content)

  // 去掉第一个标题（已在页面头部显示）和副标题行
  const processedContent = content
    .replace(/^#\s+.+\n/, '')
    .replace(/^##\s+最终版演讲稿.+\n/, '')
    .replace(/^\*\*演讲时长\*\*:.+\n/m, '')
    .replace(/^\*\*风格\*\*:.+\n/m, '')
    .replace(/^>\s+.+\n/m, '')
    .trim()

  return (
    <div className="relative xl:pr-64">
      <TableOfContents toc={toc} />

      <article className="prose prose-slate max-w-none prose-headings:scroll-mt-20">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, ...props }) => {
              const text = String(children)
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fff]+/g, '-')
                .replace(/^-|-$/g, '')
              return (
                <h1 id={id} className="text-2xl font-bold mt-12 mb-6 pb-3 border-b" {...props}>
                  {children}
                </h1>
              )
            },
            h2: ({ children, ...props }) => {
              const text = String(children)
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fff]+/g, '-')
                .replace(/^-|-$/g, '')
              return (
                <h2 id={id} className="text-xl font-semibold mt-10 mb-4 pb-2 border-b" {...props}>
                  {children}
                </h2>
              )
            },
            h3: ({ children, ...props }) => {
              const text = String(children)
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fff]+/g, '-')
                .replace(/^-|-$/g, '')
              return (
                <h3 id={id} className="text-lg font-semibold mt-8 mb-3" {...props}>
                  {children}
                </h3>
              )
            },
            p: ({ children, ...props }) => (
              <p className="text-base leading-7 mb-4 text-foreground/90" {...props}>
                {children}
              </p>
            ),
            code: ({ className, children, ...props }) => {
              const isBlock = className?.includes('language-')
              if (isBlock) {
                const lang = className?.replace('language-', '') || ''
                return (
                  <div className="relative group my-4">
                    <div className="absolute right-3 top-3 text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {lang}
                    </div>
                    <code className="block bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-4 text-sm overflow-x-auto leading-6" {...props}>
                      {children}
                    </code>
                  </div>
                )
              }
              return (
                <code className="bg-secondary text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            },
            pre: ({ children }) => <>{children}</>,
            table: ({ children, ...props }) => (
              <div className="my-6 overflow-x-auto rounded-lg border">
                <table className="w-full text-sm" {...props}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead className="bg-secondary" {...props}>
                {children}
              </thead>
            ),
            th: ({ children, ...props }) => (
              <th className="px-4 py-3 text-left font-medium text-muted-foreground" {...props}>
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="px-4 py-3 border-t" {...props}>
                {children}
              </td>
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote className="border-l-4 border-primary/30 bg-primary/5 rounded-r-lg px-4 py-3 my-4 text-sm" {...props}>
                {children}
              </blockquote>
            ),
            ul: ({ children, ...props }) => (
              <ul className="list-disc list-inside space-y-1 mb-4 text-foreground/90" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="list-decimal list-inside space-y-1 mb-4 text-foreground/90" {...props}>
                {children}
              </ol>
            ),
            hr: () => <hr className="my-8 border-border" />,
            strong: ({ children, ...props }) => (
              <strong className="font-semibold text-foreground" {...props}>
                {children}
              </strong>
            ),
            a: ({ children, href, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </article>
    </div>
  )
}
