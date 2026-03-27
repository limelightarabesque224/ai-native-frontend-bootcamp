'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import Link from 'next/link'
import { useState } from 'react'

export default function RadixDemo() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary mb-8 block">
        ← 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-2">第 3 课：Radix UI</h1>
      <p className="text-muted-foreground mb-8">
        Composition 模式 — 无头组件的底层逻辑
      </p>

      <div className="space-y-12">
        {/* Dialog 演示 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Dialog — Composition 模式
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            每个子组件都是独立的原语，可以自由组合：
          </p>

          <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger asChild>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors">
                打开 Dialog
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg w-[90vw] max-w-md">
                <Dialog.Title className="text-lg font-semibold">
                  Radix Dialog 演示
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground mt-2">
                  这个 Dialog 使用 Radix UI 原语构建，自动处理可访问性（ARIA、焦点管理、键盘导航）。
                </Dialog.Description>
                <div className="mt-4 p-3 rounded bg-secondary text-sm">
                  按 Esc 关闭 | Tab 切换焦点 | 屏幕阅读器友好
                </div>
                <Dialog.Close asChild>
                  <button className="mt-4 rounded bg-primary px-4 py-2 text-sm text-primary-foreground">
                    关闭
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <pre className="bg-secondary rounded-lg p-4 text-sm mt-4 overflow-x-auto">
            {`<Dialog.Root>
  <Dialog.Trigger />      {/* 触发器 */}
  <Dialog.Portal>         {/* 传送门 */}
    <Dialog.Overlay />    {/* 遮罩层 */}
    <Dialog.Content>      {/* 内容区 */}
      <Dialog.Title />    {/* 标题（ARIA） */}
      <Dialog.Description /> {/* 描述 */}
      <Dialog.Close />    {/* 关闭按钮 */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`}
          </pre>
        </section>

        {/* Tabs 演示 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Tabs — 键盘导航
          </h2>
          <Tabs.Root defaultValue="code" className="w-full">
            <Tabs.List className="flex border-b">
              {['code', 'preview', 'docs'].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="px-4 py-2 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors"
                >
                  {tab === 'code' ? '代码' : tab === 'preview' ? '预览' : '文档'}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="code" className="p-4">
              <p className="text-sm">用方向键切换 Tab，自动管理焦点和 ARIA 属性。</p>
            </Tabs.Content>
            <Tabs.Content value="preview" className="p-4">
              <p className="text-sm">预览区域内容</p>
            </Tabs.Content>
            <Tabs.Content value="docs" className="p-4">
              <p className="text-sm">文档区域内容</p>
            </Tabs.Content>
          </Tabs.Root>
        </section>

        {/* Switch 演示 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Switch — 可访问性
          </h2>
          <div className="flex items-center gap-3">
            <Switch.Root className="w-11 h-6 rounded-full bg-input data-[state=checked]:bg-primary transition-colors">
              <Switch.Thumb className="block w-5 h-5 rounded-full bg-background shadow translate-x-0.5 data-[state=checked]:translate-x-[22px] transition-transform" />
            </Switch.Root>
            <span className="text-sm">开启通知</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            自动注入 role=&quot;switch&quot;、aria-checked 等属性
          </p>
        </section>
      </div>
    </div>
  )
}
