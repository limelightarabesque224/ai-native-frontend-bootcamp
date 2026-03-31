'use client'

import {
  type TocItem,
  buildProcessedLessonContent,
  extractTextContent,
  generateToc,
  slugifyHeading,
} from '@/lib/lesson-markdown'
import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

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
      className="my-3 flex justify-center overflow-x-auto rounded-lg border bg-white p-4"
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: Mermaid renders trusted SVG from local lesson markdown. */
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
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
                {item.text.length > 30 ? `${item.text.slice(0, 30)}...` : item.text}
              </a>
            </li>
          ))}
      </ul>
    </nav>
  )
}

export function LessonContent({ content }: { content: string }) {
  const processedContent = buildProcessedLessonContent(content)
  const toc = generateToc(processedContent)
  let headingIndex = 0

  const getHeadingId = (level: number, children: React.ReactNode, fallbackText: string): string => {
    const nextHeading = toc[headingIndex]

    if (nextHeading && nextHeading.level === level && nextHeading.text === fallbackText) {
      headingIndex += 1
      return nextHeading.id
    }

    return slugifyHeading(fallbackText)
  }

  return (
    <div className="relative xl:pr-64">
      <TableOfContents toc={toc} />

      <article className="prose prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeHighlight, { detect: true }]]}
          components={{
            h1: ({ children, ...props }) => {
              const text = extractTextContent(children)
              const id = getHeadingId(1, children, text)
              return (
                <h1
                  {...props}
                  id={id}
                  className="scroll-mt-[64px] md:scroll-mt-[72px] mb-6 mt-12 border-b pb-3 text-2xl font-bold"
                >
                  {children}
                </h1>
              )
            },
            h2: ({ children, ...props }) => {
              const text = extractTextContent(children)
              const id = getHeadingId(2, children, text)
              return (
                <h2
                  {...props}
                  id={id}
                  className="scroll-mt-[64px] md:scroll-mt-[72px] mb-4 mt-10 border-b pb-2 text-xl font-semibold"
                >
                  {children}
                </h2>
              )
            },
            h3: ({ children, ...props }) => {
              const text = extractTextContent(children)
              const id = getHeadingId(3, children, text)
              return (
                <h3
                  {...props}
                  id={id}
                  className="scroll-mt-[64px] md:scroll-mt-[72px] mb-3 mt-8 text-lg font-semibold"
                >
                  {children}
                </h3>
              )
            },
            p: ({ children, ...props }) => (
              <p className="text-foreground/90 mb-4 text-base leading-7" {...props}>
                {children}
              </p>
            ),
            code: ({ className, children, ...props }) => {
              // 有 language- 或 hljs class 说明是块级代码（由 pre 处理容器样式）
              const isBlock = className?.includes('language-') || className?.includes('hljs')

              if (isBlock) {
                const langMatch = className?.match(/language-(\w+)/)
                const lang = langMatch?.[1] || ''

                // Mermaid 图表渲染
                if (lang === 'mermaid') {
                  const codeContent = String(children).replace(/\n$/, '')
                  return <MermaidBlock code={codeContent} />
                }

                // 块级代码：透传 children，保留 rehype-highlight 的语法高亮 span 元素
                return (
                  <code className={`${className || ''}`} {...props}>
                    {children}
                  </code>
                )
              }

              // 没有 className 的情况：可能是行内代码，也可能是无语言标记的块级代码
              // 无语言标记的块级代码会被 pre 包裹（pre 组件会处理），这里的样式通过 CSS pre code 重置
              // 行内代码不在 pre 内，CSS 重置不会影响
              return (
                <code
                  className="not-prose rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800"
                  {...props}
                >
                  {children}
                </code>
              )
            },
            pre: ({ children, ...props }) => {
              const codeElement = children as React.ReactElement<{
                className?: string
              }>
              const className = codeElement?.props?.className || ''
              const langMatch = className.match(/language-(\w+)/)
              const lang = langMatch?.[1] || ''

              // Mermaid 由 code 组件处理
              if (lang === 'mermaid') {
                return <>{children}</>
              }

              return (
                <div className="not-prose group relative my-4">
                  {lang && (
                    <div className="absolute right-3 top-3 rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                      {lang}
                    </div>
                  )}
                  <pre
                    className="overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-sm leading-6 text-[#e6edf3]"
                    {...props}
                  >
                    {children}
                  </pre>
                </div>
              )
            },
            table: ({ children, ...props }) => (
              <div className="not-prose my-6 overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm" {...props}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead className="border-b border-slate-200 bg-slate-50" {...props}>
                {children}
              </thead>
            ),
            tbody: ({ children, ...props }) => (
              <tbody className="divide-y divide-slate-200" {...props}>
                {children}
              </tbody>
            ),
            tr: ({ children, ...props }) => (
              <tr className="transition-colors hover:bg-slate-50/50" {...props}>
                {children}
              </tr>
            ),
            th: ({ children, ...props }) => (
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
                {...props}
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="px-4 py-3 text-slate-700" {...props}>
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
                className="text-foreground/90 mb-4 list-outside list-disc space-y-1 pl-6"
                {...props}
              >
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol
                className="text-foreground/90 mb-4 list-outside list-decimal space-y-1 pl-6"
                {...props}
              >
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li className="pl-1 [&>ol]:mt-2 [&>ul]:mt-2" {...props}>
                {children}
              </li>
            ),
            hr: () => <hr className="border-border my-8" />,
            strong: ({ children, ...props }) => (
              <strong className="text-foreground font-semibold" {...props}>
                {children}
              </strong>
            ),
            a: ({ children, href, ...props }) => {
              const isAnchor = href?.startsWith('#')
              return (
                <a
                  href={href}
                  {...(!isAnchor && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                  className="text-primary hover:underline"
                  {...props}
                >
                  {children}
                </a>
              )
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </article>
    </div>
  )
}
