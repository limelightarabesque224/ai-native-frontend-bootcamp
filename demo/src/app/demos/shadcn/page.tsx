import Link from 'next/link'

export default function ShadcnDemo() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary mb-8 block">
        ← 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-2">第 2 课：shadcn/ui</h1>
      <p className="text-muted-foreground mb-8">
        Copy-Paste 哲学 — 源码可见的组件库
      </p>

      <div className="space-y-12">
        {/* CLI 工作流 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">CLI 工作流</h2>
          <div className="space-y-3">
            <pre className="bg-secondary rounded-lg p-4 text-sm">
              {`# 初始化 shadcn/ui
npx shadcn@latest init

# 添加组件
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add card`}
            </pre>
            <p className="text-sm text-muted-foreground">
              组件源码直接复制到 <code className="text-primary">components/ui/</code> 目录，
              你拥有完全的所有权和定制能力。
            </p>
          </div>
        </section>

        {/* 对比：Ant Design vs shadcn/ui */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            npm 黑盒 vs 源码可见
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-3 text-destructive">Ant Design（黑盒）</h3>
              <pre className="bg-secondary rounded p-3 text-sm">
                {`import { Modal } from 'antd'

// AI 看不到 Modal 的实现
// 想定制？只能覆盖 CSS
// 想改行为？祈祷有对应 prop
<Modal title="提示" open={open}>
  内容
</Modal>`}
              </pre>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-3 text-green-600">shadcn/ui（源码可见）</h3>
              <pre className="bg-secondary rounded p-3 text-sm">
                {`import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog'

// 源码在 components/ui/dialog.tsx
// AI 可以直接读取和修改
<Dialog open={open}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>提示</DialogTitle>
    </DialogHeader>
    内容
  </DialogContent>
</Dialog>`}
              </pre>
            </div>
          </div>
        </section>

        {/* 生态工具 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">shadcn/ui 生态</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: 'TweakCN', desc: 'AI 主题编辑器，20K+ stars', url: 'tweakcn.com' },
              { name: 'magic-ui', desc: '动画组件库', url: 'magicui.design' },
              { name: 'aceternity-ui', desc: '现代 UI 组件', url: 'ui.aceternity.com' },
              { name: 'v0.dev', desc: 'AI 生成 shadcn/ui 代码', url: 'v0.dev' },
            ].map((tool) => (
              <div key={tool.name} className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                <h3 className="font-medium">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
                <p className="text-xs text-primary mt-1">{tool.url}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
