# AI-Native Frontend Demo

> 前端开发中级训练营 - 完整项目示例

这是一个基于 AI-Native 工作流构建的现代化前端项目，展示了从设计到部署的完整开发链路。

## 技术栈

- **框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS v4
- **组件库**: shadcn/ui + Radix UI
- **状态管理**: Zustand + TanStack Query
- **AI 集成**: Vercel AI SDK
- **代码质量**: Biome + TypeScript
- **包管理**: pnpm

## 快速开始

### 环境要求

- Node.js >= 20.18.0
- pnpm >= 9.0.0

### 安装依赖

```bash
pnpm install
```

### 环境变量配置

复制 `.env.example` 到 `.env.local` 并填写必要的配置:

```bash
cp .env.example .env.local
```

### 开发

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 项目结构

```
demo/
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # React 组件
│   │   ├── ui/          # shadcn/ui 基础组件
│   │   └── ...          # 业务组件
│   ├── lib/             # 工具函数和配置
│   └── styles/          # 全局样式
├── public/              # 静态资源
└── ...配置文件
```

## 代码规范

### 提交信息规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动

示例:
```bash
git commit -m "feat: 添加用户反馈列表组件"
git commit -m "fix: 修复移动端导航菜单显示问题"
```

### 代码检查

```bash
# 运行 lint 检查
pnpm lint

# 自动修复 lint 问题
pnpm lint:fix

# 格式化代码
pnpm format

# 类型检查
pnpm type-check
```

## 开发工作流

1. **设计阶段**: 使用 Figma AI 生成设计稿
2. **D2C 转换**: 通过 v0.dev 将设计转为代码
3. **开发**: 在 Cursor 中进行 AI 辅助开发
4. **组件**: 使用 shadcn/ui 构建 UI
5. **AI 功能**: 集成 Vercel AI SDK
6. **测试**: Playwright 自动化测试
7. **部署**: Vercel 一键部署

## 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)

## License

[MIT](./LICENSE)
