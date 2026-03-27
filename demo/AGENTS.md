# AI-Native 前端项目开发指南

## 项目概述
- **项目名称**: AI-Native Frontend Demo
- **技术栈**: Next.js 15 + TypeScript + Tailwind CSS v4 + shadcn/ui + Radix UI
- **包管理**: pnpm
- **代码质量**: Biome

## 代码规范

### TypeScript
- 使用严格模式 (`strict: true`)
- 不使用 `any` 类型
- 优先使用 `interface` 而非 `type`
- 函数必须有明确的返回类型

### React 组件
- 使用函数式组件 + Hooks
- 一个文件只导出一个主组件
- Props 类型使用 interface 定义在组件上方

### 样式
- 只使用 Tailwind utility classes
- 使用 `cn()` 工具函数合并条件类名
- 不写内联 style，不使用 CSS Modules

### 文件组织
```
src/
├── app/              # Next.js App Router 页面
├── components/
│   ├── ui/           # shadcn/ui 组件（自动生成）
│   └── features/     # 业务组件
├── lib/              # 工具函数
├── hooks/            # 自定义 Hooks
├── stores/           # Zustand stores
└── types/            # 类型定义
```

## 禁止事项
- ❌ 不使用 `any`
- ❌ 不写内联样式
- ❌ 不使用 CSS-in-JS
- ❌ 不直接修改 `components/ui/` 下的 shadcn 组件
- ❌ 不使用 `useEffect` 做数据请求（用 TanStack Query）
