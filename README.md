# 大模型时代的前端开发 - 中级训练营

> 科大讯飞 2026 前端开发中级训练营培训材料

## 课程定位

**不是教"如何用 AI 写代码"，而是教"如何构建 AI-Native 的前端技术栈和工作流"。**

- **受众**：3-5 年中高级前端工程师
- **总课时**：12 节课，27 小时
- **形式**：讲解 + 演示，对比驱动式教学
- **特色**：深讲一个，横向对比多个

## 课程目录

| 课程 | 主题 | 深讲 | 横向对比 |
|------|------|------|----------|
| [第 0 课](第0课-认知重构/) | 认知重构 - AI 友好性是新的选型维度 | AI 友好性框架 | — |
| [第 1 课](第1课-Tailwind-CSS-v4/) | 样式方案革命 - Tailwind CSS v4 | Tailwind v4 | UnoCSS, CSS Modules, styled-components |
| [第 2 课](第2课-shadcn-ui/) | 组件库范式转移 - shadcn/ui | shadcn/ui | Ant Design, MUI, Chakra UI, Park UI |
| [第 3 课](第3课-Radix-UI/) | 无头组件的底层逻辑 - Radix UI | Radix UI | Headless UI, React Aria, Ark UI |
| [第 4 课](第4课-Design-to-Code-上/) | Design to Code（上）- 设计工具 | Figma AI | Penpot, Pencil.dev, Google Stitch |
| [第 5 课](第5课-Design-to-Code-下/) | Design to Code（下）- AI 生成工具 | v0.dev | Bolt.new, Lovable, Builder.io |
| [第 6 课](第6课-Monorepo/) | AI 友好的项目架构 - Monorepo | Turborepo + pnpm | Nx, Bun workspace, Rush |
| [第 7 课](第7课-MCP-Tools/) | MCP Tools - 浏览器自动化与测试 | Playwright MCP | Puppeteer, Browserbase, Stagehand |
| [第 8 课](第8课-AI编程工具/) | AI 编程工具与 Memory 管理 | Cursor | Windsurf, Copilot, Claude Code |
| [第 9 课](第9课-Vercel-AI-SDK/) | 前端 AI 功能集成 | Vercel AI SDK | LangChain.js, OpenAI SDK |
| [第 10 课](第10课-工程化与全栈化/) | 工程化与全栈化 | Biome + Next.js | tRPC, Prisma |
| [第 11 课](第11课-全链路整合/) | 全链路整合与未来展望 | 完整工作流 | — |

## 配套材料

| 文档 | 说明 |
|------|------|
| [课程设计文档.md](课程设计文档.md) | 完整的课程设计方案、技术地图、参考资料 |
| [AI-Native项目配置模板.md](AI-Native项目配置模板.md) | 可直接使用的项目配置（AGENTS.md、.cursorrules、biome.json 等） |
| [演讲大纲.md](演讲大纲.md) | 11 节课的演讲大纲概要 |

## AI-Native 技术栈全景图

```
┌─────────────────────────────────────────────────────────────┐
│                    AI-Native 前端技术栈                       │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│  样式层   │  组件层   │ 设计工具  │  架构层   │   开发工具      │
├──────────┼──────────┼──────────┼──────────┼─────────────────┤
│Tailwind  │shadcn/ui │Figma AI  │Turborepo │Cursor           │
│CSS v4    │Radix UI  │v0.dev    │pnpm      │Windsurf         │
│          │          │Bolt.new  │          │Claude Code      │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│  MCP 工具层: Playwright MCP | Puppeteer | Browserbase       │
├─────────────────────────────────────────────────────────────┤
│  AI 集成层: Vercel AI SDK | LangChain.js                    │
├─────────────────────────────────────────────────────────────┤
│  工程化层: Biome | TypeScript Strict | CI/CD                │
├─────────────────────────────────────────────────────────────┤
│  全栈化层: Next.js Server Actions | tRPC | Prisma           │
└─────────────────────────────────────────────────────────────┘
```

## 核心原则

1. **语义内联** — Tailwind: 样式在 HTML 中，AI 无需跨文件推理
2. **源码可见** — shadcn/ui: 代码在项目中，AI 可以直接修改
3. **组合优于继承** — Radix UI: Composition 模式，AI 更易理解
4. **约定优于配置** — Monorepo: 文件结构约定，AI 快速定位
5. **Memory 管理** — AGENTS.md + .cursorrules: 让 AI 越用越懂你

## 快速开始

```bash
# 查看课程设计文档
open 课程设计文档.md

# 查看某节课的演讲稿
open 第0课-认知重构/final-content.md

# 获取可直接使用的项目配置模板
open AI-Native项目配置模板.md
```

## 文件结构

```
.
├── README.md                      # 本文件
├── 课程设计文档.md                  # 完整课程设计方案
├── AI-Native项目配置模板.md         # 可直接使用的配置模板
├── 演讲大纲.md                     # 演讲大纲概要
├── 第0课-认知重构/
│   └── final-content.md           # 演讲稿
├── 第1课-Tailwind-CSS-v4/
│   └── final-content.md
├── 第2课-shadcn-ui/
│   └── final-content.md
├── 第3课-Radix-UI/
│   └── final-content.md
├── 第4课-Design-to-Code-上/
│   └── final-content.md
├── 第5课-Design-to-Code-下/
│   └── final-content.md
├── 第6课-Monorepo/
│   └── final-content.md
├── 第7课-MCP-Tools/
│   └── final-content.md
├── 第8课-AI编程工具/
│   └── final-content.md
├── 第9课-Vercel-AI-SDK/
│   └── final-content.md
├── 第10课-工程化与全栈化/
│   └── final-content.md
└── 第11课-全链路整合/
    └── final-content.md
```
