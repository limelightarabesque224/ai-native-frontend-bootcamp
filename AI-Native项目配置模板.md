# AI-Native 前端项目配置模板

本文档提供可直接使用的配置文件和规范模板，帮助你快速搭建 AI 友好的前端项目。

---

## 一、项目规范文件

### 1.1 AGENTS.md（推荐）

放在项目根目录，供所有 AI 工具读取。

```markdown
# 项目 AI 开发指南

## 项目概述
- **项目名称**: [项目名称]
- **技术栈**: React 19 + Next.js 15 + TypeScript
- **样式方案**: Tailwind CSS v4
- **组件库**: shadcn/ui + Radix UI
- **状态管理**: Zustand
- **数据请求**: TanStack Query (React Query)
- **表单处理**: React Hook Form + Zod
- **构建工具**: Turborepo + pnpm

## 代码规范

### TypeScript
- 使用严格模式 (`strict: true`)
- 所有函数必须有明确的返回类型
- 优先使用 `interface` 而非 `type`（除非需要联合类型）
- 使用 Zod 进行运行时类型验证

### React 组件
- 使用函数式组件 + Hooks
- 组件文件名使用 PascalCase: `UserProfile.tsx`
- 一个文件只导出一个主组件
- Props 类型定义在组件文件顶部

```typescript
// ✅ 推荐
interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // ...
}
```

### 样式规范
- 使用 Tailwind utility classes，不写自定义 CSS
- 使用 `cn()` 工具函数合并类名
- 响应式设计使用 Tailwind 断点: `sm:` `md:` `lg:` `xl:` `2xl:`

```tsx
// ✅ 推荐
<div className={cn(
  "flex items-center gap-4 p-4",
  "bg-white dark:bg-gray-900",
  "rounded-lg shadow-sm",
  isActive && "ring-2 ring-blue-500"
)}>
```

### 文件组织

```
src/
├── app/                    # Next.js App Router 页面
│   ├── (auth)/            # 路由组：认证相关页面
│   ├── (dashboard)/       # 路由组：仪表盘页面
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui 组件（自动生成）
│   ├── features/          # 业务组件（按功能模块组织）
│   │   ├── auth/
│   │   ├── user/
│   │   └── dashboard/
│   └── layouts/           # 布局组件
├── lib/
│   ├── utils.ts           # 工具函数
│   ├── api.ts             # API 客户端
│   └── validations/       # Zod schemas
├── hooks/                 # 自定义 Hooks
├── stores/                # Zustand stores
└── types/                 # TypeScript 类型定义
```

## 命名约定

### 文件命名
- 组件: `UserProfile.tsx`
- Hooks: `useUserData.ts`
- Utils: `formatDate.ts`
- Types: `user.types.ts`
- Stores: `userStore.ts`
- API: `userApi.ts`

### 变量命名
- 布尔值: `isLoading`, `hasError`, `canEdit`
- 事件处理: `handleClick`, `handleSubmit`, `onUserUpdate`
- 异步函数: `fetchUser`, `createPost`, `updateProfile`

## 常见任务模板

### 创建新页面
1. 在 `app/` 下创建路由文件夹
2. 创建 `page.tsx` 和 `layout.tsx`（如需要）
3. 使用 Server Components 获取数据
4. 使用 Client Components 处理交互

### 添加新组件
1. 如果是 UI 组件，使用 `npx shadcn@latest add [component]`
2. 如果是业务组件，在 `components/features/` 下创建
3. 导出组件时使用命名导出

### 添加新 API
1. 在 `app/api/` 下创建 route.ts
2. 使用 Next.js Route Handlers
3. 使用 Zod 验证请求体

```typescript
// app/api/users/route.ts
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const data = createUserSchema.parse(body)
  // ...
}
```

## AI 工具使用建议

### 生成组件时
- 明确指定使用 shadcn/ui 组件
- 说明响应式需求
- 指定状态管理方式

示例 Prompt:
```
创建一个用户资料卡片组件，使用 shadcn/ui 的 Card 组件，
包含头像、姓名、邮箱，支持编辑和删除操作。
使用 Tailwind CSS 实现响应式布局。
```

### 重构代码时
- 保持现有的文件结构
- 不要改变导入路径
- 保持 TypeScript 类型定义

### 修复错误时
- 优先查看 TypeScript 错误
- 检查 Zod 验证错误
- 查看 React Query 的错误状态

## 禁止事项

❌ 不要使用 `any` 类型
❌ 不要写内联样式（style prop）
❌ 不要使用 CSS Modules 或 styled-components
❌ 不要直接修改 `components/ui/` 下的 shadcn 组件（应该通过 props 定制）
❌ 不要在组件内部写复杂的业务逻辑（提取到 hooks 或 utils）
❌ 不要使用 `useEffect` 做数据请求（使用 React Query）

## 性能优化

- 使用 `React.memo` 包裹纯展示组件
- 使用 `useMemo` 和 `useCallback` 优化计算和回调
- 图片使用 Next.js `<Image>` 组件
- 大列表使用虚拟滚动（react-virtual）
- 路由使用 Next.js `<Link>` 组件

## 可访问性

- 所有交互元素必须可键盘访问
- 使用语义化 HTML 标签
- 图片必须有 alt 属性
- 表单必须有 label
- 使用 Radix UI 的可访问性原语
```

---

### 1.2 .cursorrules

放在项目根目录，Cursor 专用配置。

```
# Cursor AI 规则配置

## 技术栈
- React 19 + Next.js 15 App Router
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui + Radix UI
- pnpm + Turborepo

## 代码生成规则

### 组件生成
- 使用函数式组件 + TypeScript
- Props 类型使用 interface
- 导出使用命名导出（named export）
- 样式使用 Tailwind utility classes
- 优先使用 shadcn/ui 组件

### 文件路径
- UI 组件: components/ui/
- 业务组件: components/features/
- Hooks: hooks/
- Utils: lib/
- Types: types/

### 导入顺序
1. React 相关
2. 第三方库
3. 本地组件
4. 本地 hooks
5. 本地 utils
6. 类型定义

### TypeScript
- 不使用 any
- 函数必须有返回类型
- 使用 Zod 做运行时验证
- 优先使用 interface 而非 type

### 样式
- 只使用 Tailwind classes
- 使用 cn() 合并类名
- 不写内联 style
- 不使用 CSS Modules

## 禁止
- 不使用 any
- 不写内联样式
- 不使用 CSS-in-JS
- 不直接修改 shadcn/ui 组件源码
```

---

## 二、项目配置文件

### 2.1 package.json

```json
{
  "name": "my-ai-native-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.0.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.59.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "ai": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@biomejs/biome": "^1.9.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

### 2.2 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### 2.3 biome.json

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noNonNullAssertion": "off"
      },
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "asNeeded"
    }
  }
}
```

---

### 2.4 tailwind.config.ts (v4)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

### 2.5 components.json (shadcn/ui 配置)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

### 2.6 turbo.json (Monorepo 配置)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 三、常用代码模板

### 3.1 lib/utils.ts (工具函数)

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
```

---

### 3.2 常用 Hooks

#### hooks/useMediaQuery.ts

```typescript
import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
```

#### hooks/useDebounce.ts

```typescript
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

---

### 3.3 Zustand Store 模板

#### stores/userStore.ts

```typescript
import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
}

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
```

---

### 3.4 React Query 模板

#### lib/queryClient.ts

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 分钟
      retry: 1,
    },
  },
})
```

#### hooks/useUserData.ts

```typescript
import { useQuery } from '@tanstack/react-query'

interface User {
  id: string
  name: string
  email: string
}

async function fetchUser(userId: string): Promise<User> {
  const res = await fetch(`/api/users/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

export function useUserData(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  })
}
```

---

### 3.5 表单模板 (React Hook Form + Zod)

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  name: z.string().min(2, '姓名至少 2 个字符'),
  email: z.string().email('请输入有效的邮箱'),
})

type FormValues = z.infer<typeof formSchema>

export function UserForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="请输入姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input type="email" placeholder="请输入邮箱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
}
```

---

## 四、快速启动指南

### 4.1 创建新项目

```bash
# 1. 创建 Next.js 项目
npx create-next-app@latest my-app --typescript --tailwind --app

# 2. 进入项目目录
cd my-app

# 3. 初始化 shadcn/ui
npx shadcn@latest init

# 4. 安装依赖
pnpm install zustand @tanstack/react-query react-hook-form zod @hookform/resolvers

# 5. 安装 Biome
pnpm add -D @biomejs/biome

# 6. 初始化 Biome
pnpm biome init

# 7. 添加常用 shadcn/ui 组件
npx shadcn@latest add button input form dialog
```

### 4.2 项目结构

```
my-app/
├── .cursorrules              # Cursor 规则
├── AGENTS.md                 # AI 项目指南
├── biome.json                # Biome 配置
├── components.json           # shadcn/ui 配置
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/               # shadcn/ui 组件
│   │   └── features/         # 业务组件
│   ├── lib/
│   │   ├── utils.ts
│   │   └── queryClient.ts
│   ├── hooks/
│   ├── stores/
│   └── types/
```

---

## 五、常用命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint

# 代码修复
pnpm lint:fix

# 格式化
pnpm format

# 类型检查
pnpm type-check

# 添加 shadcn/ui 组件
npx shadcn@latest add [component-name]
```

---

**文档完成！所有配置文件和模板都可以直接复制使用。**

---

## 六、AI Memory 管理指南

### 6.1 为什么需要 Memory 管理

AI 工具（Cursor、Claude Code）每次对话都是"失忆"的，需要主动管理记忆：
- 让 AI 理解项目上下文、技术决策、团队规范
- 避免重复解释相同的问题
- 提高开发效率，让 AI 越用越懂你的项目

### 6.2 Memory 的三个层级

| 层级 | 存储位置 | 生命周期 | 用途 |
|------|----------|----------|------|
| 项目级 | `AGENTS.md` / `.claude/memory/` | 永久 | 项目规范、技术栈、重要决策 |
| 会话级 | 对话中主动告知 | 当前会话 | 当前任务的上下文 |
| 个人级 | `~/.claude/memory/` | 永久 | 个人偏好、常用命令 |

---

### 6.3 项目级 Memory 模板

在 `AGENTS.md` 中添加 Memory 部分：

```markdown
## 项目记忆（Memory）

### 技术决策历史
- **2026-03-20**: 选择 Tailwind v4 而非 UnoCSS
  - 原因：生态更成熟，AI 工具支持更好
  - 决策人：团队技术评审会议

- **2026-03-15**: 使用 Zustand 而非 Redux
  - 原因：更轻量，API 更简洁，适合中小型项目
  - 决策人：@张三

- **2026-03-10**: 表单统一使用 React Hook Form + Zod
  - 原因：类型安全 + 运行时验证
  - 决策人：前端团队

### 已知问题与解决方案
- **UserProfile 组件性能问题**
  - 问题：大量用户数据导致渲染卡顿
  - 解决：使用 React.memo + useMemo 优化
  - PR: #123
  - 修复时间：2026-03-18

- **Safari 浏览器样式问题**
  - 问题：Flexbox 在 Safari 中表现异常
  - 解决：添加 `-webkit-` 前缀
  - 相关文件：`components/ui/dialog.tsx`

### 不要做的事情（反模式）
- ❌ 不要使用 `any` 类型
- ❌ 不要直接修改 `components/ui/` 下的 shadcn 组件
- ❌ 不要使用 `useEffect` 做数据请求（用 React Query）
- ❌ 不要使用 CSS Modules（统一用 Tailwind）

### 团队约定
- 所有 API 请求必须有错误处理和 loading 状态
- 表单提交前必须验证
- 组件必须有 TypeScript 类型定义
- 新功能必须有单元测试（使用 Vitest）

### 常见任务的标准做法
- **添加新页面**: 在 `app/` 下创建文件夹 → 创建 `page.tsx` → 使用 Server Component
- **添加新组件**: 先检查 shadcn/ui 是否有 → 没有则在 `components/features/` 创建
- **添加新 API**: 在 `app/api/` 创建 route.ts → 使用 Zod 验证
```

---

### 6.4 会话级 Memory（主动告知）

在开始新任务时，主动告诉 AI 上下文：

```
# 好的示例
"我正在重构用户认证模块。
已完成：登录页面（使用 React Hook Form + Zod）
进行中：注册页面
要求：保持与登录页面一致的风格和验证逻辑"

# 不好的示例
"帮我做注册页面"  # 缺少上下文
```

在任务完成后，总结关键信息：

```
"记住：
- 注册页面的 Zod schema 在 lib/validations/auth.ts
- 密码强度检查逻辑在 lib/password.ts
- 邮箱验证使用了第三方服务 SendGrid"
```

---

### 6.5 个人级 Memory

在 `~/.claude/memory/` 创建个人偏好文件：

#### preferences.md

```markdown
# 我的开发偏好

## 代码风格
- 我喜欢函数式组件，不用 class 组件
- 我喜欢用 `const` 而非 `let`
- 我喜欢用箭头函数
- 我喜欢用解构赋值

## 命名习惯
- 布尔值：`isLoading`, `hasError`, `canEdit`
- 事件处理：`handleClick`, `handleSubmit`
- 异步函数：`fetchUser`, `createPost`

## 工具偏好
- 包管理器：pnpm
- 测试框架：Vitest
- 状态管理：Zustand
- 数据请求：TanStack Query
```

#### shortcuts.md

```markdown
# 我的常用命令

## 开发
```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm lint:fix     # 修复代码问题
```

## shadcn/ui
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

## Git
```bash
git add .
git commit -m "feat: xxx"
git push
```
```

---

### 6.6 Memory 最佳实践

#### ✅ 应该记录的内容

1. **技术决策和原因**
   - 为什么选择 A 而不是 B
   - 决策的背景和约束条件

2. **已知问题和解决方案**
   - 遇到过的坑
   - 解决方案和相关 PR

3. **团队约定和规范**
   - 代码风格
   - 文件组织
   - 命名约定

4. **重要的业务逻辑**
   - 复杂的计算逻辑
   - 特殊的业务规则

#### ❌ 不应该记录的内容

1. **代码细节**
   - AI 可以直接读代码，不需要记录

2. **临时信息**
   - 当前正在做的任务（会话结束就过期）

3. **显而易见的事情**
   - "使用 TypeScript"（从 tsconfig.json 就能看出来）

---

### 6.7 Memory 维护

#### 定期清理（每月一次）
```markdown
# 检查清单
- [ ] 删除已过期的技术决策
- [ ] 更新已解决的问题
- [ ] 补充新的团队约定
- [ ] 删除不再相关的内容
```

#### 版本控制
- 将 `AGENTS.md` 纳入 Git 版本控制
- 重要变更要写 commit message
- 团队成员共同维护

---

### 6.8 实战示例

#### 场景：新成员加入项目

**传统方式**：
- 口头讲解项目规范（容易遗漏）
- 新成员问 AI，AI 给出错误建议
- 反复修改代码

**使用 Memory**：
- 新成员读 `AGENTS.md`
- AI 自动遵循项目规范
- 代码一次性符合要求

#### 场景：修复重复出现的 Bug

**传统方式**：
- 每次都要重新调查
- 可能用不同的方法修复
- 没有记录，下次还会遇到

**使用 Memory**：
- 在 `AGENTS.md` 记录问题和解决方案
- AI 自动避免相同问题
- 团队成员都能看到

---

**Memory 管理是 AI-Native 开发的核心技能，投入时间维护 Memory 会带来长期收益！**

