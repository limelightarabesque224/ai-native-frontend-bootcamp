'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'

// ========== 对比演示：BEM vs Tailwind ==========

// BEM 方式的用户卡片（需要额外 CSS 文件）
function BemUserCard() {
  return (
    <div className="bem-demo">
      <h3 className="text-lg font-semibold mb-4">BEM 方式</h3>
      <p className="text-sm text-muted-foreground mb-4">
        需要单独的 CSS 文件，AI 难以跨文件推理
      </p>
      <pre className="bg-secondary rounded-lg p-4 text-sm overflow-x-auto">
        {`// UserCard.jsx
import styles from './UserCard.module.css'

<div className={styles['user-card']}>
  <img className={styles['user-card__avatar']} />
  <div className={styles['user-card__info']}>
    <h3 className={styles['user-card__name']}>{name}</h3>
    <p className={styles['user-card__email']}>{email}</p>
  </div>
</div>

// UserCard.module.css (另一个文件)
.user-card { display: flex; padding: 16px; }
.user-card__avatar { width: 48px; height: 48px; }
.user-card__name { font-weight: 600; }
.user-card__email { color: #666; font-size: 14px; }`}
      </pre>
      <p className="text-sm text-destructive mt-2">2 个文件，40+ 行代码</p>
    </div>
  )
}

// Tailwind 方式的用户卡片（单文件）
function TailwindUserCard() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Tailwind 方式</h3>
      <p className="text-sm text-muted-foreground mb-4">
        样式内联，AI 一眼看懂，单文件完成
      </p>

      {/* 实际渲染的组件 */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          AI
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">AI-Native 开发者</h3>
          <p className="text-sm text-muted-foreground">dev@ai-native.com</p>
        </div>
        <button className="px-3 py-1.5 text-sm border rounded-md hover:bg-secondary transition-colors">
          编辑
        </button>
      </div>

      <pre className="bg-secondary rounded-lg p-4 text-sm overflow-x-auto mt-4">
        {`<div className="flex items-center gap-4 p-4
     bg-white rounded-lg shadow-sm border">
  <Avatar className="w-12 h-12" />
  <div className="flex-1">
    <h3 className="font-semibold">{name}</h3>
    <p className="text-sm text-muted-foreground">{email}</p>
  </div>
  <Button variant="outline" size="sm">编辑</Button>
</div>`}
      </pre>
      <p className="text-sm text-green-600 mt-2">1 个文件，10 行代码</p>
    </div>
  )
}

// Tailwind v4 新特性演示
function TailwindV4Features() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Tailwind v4 新特性</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h4 className="font-medium mb-2">CSS-first 配置</h4>
          <pre className="bg-secondary rounded p-3 text-sm">
            {`/* globals.css */
@import 'tailwindcss';

@theme {
  --color-brand: #3b82f6;
  --spacing-18: 4.5rem;
}

@plugin "@tailwindcss/forms";`}
          </pre>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-medium mb-2">v3 配置（对比）</h4>
          <pre className="bg-secondary rounded p-3 text-sm">
            {`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#3b82f6',
      },
    },
  },
}`}
          </pre>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h4 className="font-medium mb-2">容器查询</h4>
        <div className="@container">
          <div className="@lg:flex @lg:gap-4 space-y-2 @lg:space-y-0">
            <div className="flex-1 rounded bg-primary/10 p-4 text-center text-sm">
              区域 A（容器宽度 &gt;= lg 时横排）
            </div>
            <div className="flex-1 rounded bg-primary/10 p-4 text-center text-sm">
              区域 B
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TailwindDemo() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary mb-8 block">
        ← 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-2">第 1 课：Tailwind CSS v4</h1>
      <p className="text-muted-foreground mb-8">
        为什么 Utility-first CSS 是 AI 最佳拍档
      </p>

      <div className="space-y-12">
        {/* 对比演示 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            BEM vs Tailwind 对比
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <BemUserCard />
            <TailwindUserCard />
          </div>
        </section>

        {/* v4 新特性 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            Tailwind v4 核心变化
          </h2>
          <TailwindV4Features />
        </section>

        {/* cn() 工具函数 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
            cn() 条件类名
          </h2>
          <ConditionalClassDemo />
        </section>
      </div>
    </div>
  )
}

function ConditionalClassDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        使用 cn() 函数优雅地组合条件类名：
      </p>
      <div className="flex gap-3">
        {['default', 'active', 'disabled'].map((state) => (
          <div
            key={state}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm transition-all',
              state === 'active' && 'border-primary bg-primary text-primary-foreground',
              state === 'disabled' && 'opacity-50 cursor-not-allowed',
              state === 'default' && 'hover:border-primary hover:shadow-sm'
            )}
          >
            {state}
          </div>
        ))}
      </div>
      <pre className="bg-secondary rounded-lg p-4 text-sm">
        {`import { cn } from '@/lib/utils'

<div className={cn(
  "rounded-lg border px-4 py-2",
  isActive && "border-primary bg-primary",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  {label}
</div>`}
      </pre>
    </div>
  )
}
