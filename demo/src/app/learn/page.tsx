import Link from 'next/link'
import { lessons } from '@/lib/lessons'

export default function LearnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          大模型时代的前端开发
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-6">
          不是教"如何用 AI 写代码"，而是教"如何构建 AI-Native 的前端技术栈和工作流"
        </p>
        <div className="flex gap-4 md:gap-6 text-sm text-muted-foreground">
          <span>12 节课</span>
          <span>27 小时</span>
          <span>具备项目经验的前端工程师</span>
        </div>
      </div>

      {/* 技术栈全景图 */}
      <div className="rounded-xl border bg-secondary/30 p-6 mb-12">
        <h2 className="font-semibold mb-4">AI-Native 技术栈全景图</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { layer: '样式层', techs: ['Tailwind CSS v4'] },
            { layer: '组件层', techs: ['shadcn/ui', 'Radix UI'] },
            { layer: '设计工具', techs: ['Figma AI', 'v0.dev'] },
            { layer: '架构层', techs: ['Turborepo', 'pnpm'] },
            { layer: '测试层', techs: ['Playwright MCP'] },
            { layer: '开发工具', techs: ['Cursor', 'Claude Code'] },
            { layer: 'AI 集成', techs: ['Vercel AI SDK'] },
            { layer: '工程化', techs: ['Biome', 'tRPC'] },
          ].map((item) => (
            <div key={item.layer} className="rounded-lg bg-background border p-3">
              <div className="text-xs font-medium text-muted-foreground mb-1">{item.layer}</div>
              {item.techs.map((tech) => (
                <div key={tech} className="text-sm font-medium">{tech}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 课程列表 */}
      <h2 className="text-2xl font-semibold mb-6">课程目录</h2>
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/learn/${lesson.id}`}
            className="group flex items-center gap-3 md:gap-4 rounded-xl border p-4 md:p-5 hover:border-primary hover:shadow-md transition-all"
          >
            <span className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-base md:text-lg font-bold">
              {lesson.number}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                  第 {lesson.number} 课：{lesson.title}
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  {lesson.duration}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{lesson.subtitle}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {lesson.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="hidden sm:inline text-muted-foreground group-hover:text-primary transition-colors">
              →
            </span>
          </Link>
        ))}
      </div>

      {/* 核心原则 */}
      <div className="mt-12 rounded-xl border bg-secondary/30 p-6">
        <h2 className="font-semibold mb-4">五大核心原则</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { principle: '语义内联', desc: 'Tailwind — 样式在 HTML 中，AI 无需跨文件推理' },
            { principle: '源码可见', desc: 'shadcn/ui — 代码在项目中，AI 可以直接修改' },
            { principle: '组合优于继承', desc: 'Radix UI — Composition 模式，AI 更易理解' },
            { principle: '约定优于配置', desc: 'Monorepo — 文件结构约定，AI 快速定位' },
            { principle: 'Memory 管理', desc: 'AGENTS.md — 让 AI 越用越懂你和你的项目' },
          ].map((item) => (
            <div key={item.principle} className="flex gap-3 items-start">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                ✓
              </span>
              <div>
                <div className="font-medium text-sm">{item.principle}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
