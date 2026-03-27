import Link from 'next/link'

const demos = [
  {
    title: '第 1 课：Tailwind CSS v4',
    description: 'BEM vs Tailwind 对比，CSS-first 配置，Oxide 引擎',
    href: '/demos/tailwind',
    lesson: 1,
  },
  {
    title: '第 2 课：shadcn/ui',
    description: 'Copy-Paste 哲学，CLI 工作流，组件定制',
    href: '/demos/shadcn',
    lesson: 2,
  },
  {
    title: '第 3 课：Radix UI',
    description: 'Composition 模式，可访问性原语，无头组件',
    href: '/demos/radix',
    lesson: 3,
  },
  {
    title: '表单演示',
    description: 'React Hook Form + Zod 验证，shadcn/ui Form 组件',
    href: '/demos/form',
    lesson: 10,
  },
  {
    title: '第 9 课：AI 聊天',
    description: 'Vercel AI SDK，useChat Hook，流式响应',
    href: '/demos/ai-chat',
    lesson: 9,
  },
]

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          大模型时代的前端开发
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-Native 技术栈演示项目
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {demos.map((demo) => (
          <Link
            key={demo.href}
            href={demo.href}
            className="group block rounded-lg border border-border p-6 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {demo.lesson}
              </span>
              <h2 className="font-semibold group-hover:text-primary transition-colors">
                {demo.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">{demo.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-16 rounded-lg bg-secondary p-6">
        <h2 className="font-semibold mb-3">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {[
            'Next.js 15',
            'TypeScript',
            'Tailwind CSS v4',
            'shadcn/ui',
            'Radix UI',
            'Zustand',
            'TanStack Query',
            'React Hook Form',
            'Zod',
            'Biome',
            'Vercel AI SDK',
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-background px-3 py-1 text-sm border border-border"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
