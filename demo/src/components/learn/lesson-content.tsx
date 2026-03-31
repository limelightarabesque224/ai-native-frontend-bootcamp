'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState, useEffect, useRef } from 'react'
import mermaid from 'mermaid'

// 生成唯一 ID
let mermaidId = 0
const generateId = () => `mermaid-${++mermaidId}`

// Mermaid 渲染组件
function MermaidBlock({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    })
  }, [])

  useEffect(() => {
    const renderDiagram = async () => {
      const id = generateId()
      try {
        const { svg: renderedSvg } = await mermaid.render(id, code.trim())
        setSvg(renderedSvg)
        setError('')
      } catch (err) {
        console.error('Mermaid render error:', err)
        setError(String(err))
      }
    }
    renderDiagram()
  }, [code])

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <div className="mb-2 font-medium">Mermaid 图表渲染错误</div>
        <pre className="overflow-auto text-xs">{code}</pre>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-lg border bg-white p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

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
    <nav className="fixed right-8 top-24 hidden max-h-[calc(100vh-120px)] w-56 overflow-y-auto text-sm xl:block">
      <div className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
        目录
      </div>
      <ul className="space-y-1">
        {toc
          .filter((item) => item.level <= 2)
          .map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block border-l-2 py-1 transition-colors ${
                  item.level === 1 ? 'pl-3' : 'pl-5'
                } ${
                  activeId === item.id
                    ? 'border-primary text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:border-border border-transparent'
                }`}
              >
                {item.text.length > 30
                  ? `${item.text.slice(0, 30)}...`
                  : item.text}
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

      <article className="prose prose-slate prose-headings:scroll-mt-20 max-w-none">
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
                <h1
                  id={id}
                  className="mb-6 mt-12 border-b pb-3 text-2xl font-bold"
                  {...props}
                >
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
                <h2
                  id={id}
                  className="mb-4 mt-10 border-b pb-2 text-xl font-semibold"
                  {...props}
                >
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
                <h3
                  id={id}
                  className="mb-3 mt-8 text-lg font-semibold"
                  {...props}
                >
                  {children}
                </h3>
              )
            },
            p: ({ children, ...props }) => (
              <p
                className="text-foreground/90 mb-4 text-base leading-7"
                {...props}
              >
                {children}
              </p>
            ),
            code: ({ className, children, ...props }) => {
              const isBlock = className?.includes('language-')
              if (isBlock) {
                const lang = className?.replace('language-', '') || ''
                const codeContent = String(children).replace(/\n$/, '')

                // Mermaid 图表渲染
                if (lang === 'mermaid') {
                  return <MermaidBlock code={codeContent} />
                }

                return (
                  <div className="group relative my-4">
                    <div className="text-muted-foreground bg-secondary/80 absolute right-3 top-3 rounded px-2 py-0.5 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      {lang}
                    </div>
                    <code
                      className="block overflow-x-auto rounded-lg bg-[#1e1e2e] p-3 text-xs leading-6 text-[#cdd6f4] md:p-4 md:text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  </div>
                )
              }
              return (
                <code
                  className="bg-secondary text-primary rounded px-1.5 py-0.5 font-mono text-sm"
                  {...props}
                >
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
              <th
                className="text-muted-foreground px-4 py-3 text-left font-medium"
                {...props}
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="border-t px-4 py-3" {...props}>
                {children}
              </td>
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote
                className="border-primary/30 bg-primary/5 my-4 rounded-r-lg border-l-4 px-4 py-3 text-sm"
                {...props}
              >
                {children}
              </blockquote>
            ),
            ul: ({ children, ...props }) => (
              <ul
                className="text-foreground/90 mb-4 list-inside list-disc space-y-1"
                {...props}
              >
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol
                className="text-foreground/90 mb-4 list-inside list-decimal space-y-1"
                {...props}
              >
                {children}
              </ol>
            ),
            hr: () => <hr className="border-border my-8" />,
            strong: ({ children, ...props }) => (
              <strong className="text-foreground font-semibold" {...props}>
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
      <TableOfContents toc={toc} />
    </div>
  )
}
