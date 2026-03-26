# AI 编程工具与 Memory 管理
## 最终版演讲稿（融合版）

**演讲时长**: 2.5 小时
**风格**: 故事开场 + 技术深度 + 实践建议

---

## Opening Hook（10 min）

大家好，欢迎来到第 8 课。

今天我想先讲一个我自己的经历。

去年我开始用 Cursor 写代码。刚开始的时候，体验很一般——AI 生成的代码经常不符合我们的项目规范，用的是 CSS Modules 而不是 Tailwind，组件风格也不统一。

我当时觉得："AI 也就这样吧，还是得自己写。"

后来有个同事跟我说："你配置 .cursorrules 了吗？"

我说："那是什么？"

他帮我写了一个 .cursorrules 文件，大概 30 行。然后又在项目根目录加了一个 AGENTS.md。

**从那天起，Cursor 生成的代码质量提升了一个档次。**

- 自动使用 Tailwind + shadcn/ui
- 自动遵循我们的命名规范
- 自动使用 TypeScript 严格模式
- 甚至知道我们的 API 路由结构

这就是今天要讲的两个核心主题：
1. **AI 编程工具**：不只是代码补全，而是 AI 结对编程
2. **Memory 管理**：让 AI 越用越懂你和你的项目

---

## Section 1：AI 编程工具的定位（15 min）

### 不只是代码补全

很多人把 AI 编程工具当成"高级自动补全"。这是对它最大的误解。

**代码补全**：你写了一半，AI 帮你补完
```
// 你写了
function getUserBy
// AI 补全
function getUserById(id: string) { ... }
```

**AI 结对编程**：你描述需求，AI 帮你实现
```
// 你说
"创建一个用户资料页面，包含头像上传、表单验证、
保存到数据库。使用 Server Actions + Zod + shadcn/ui"

// AI 生成完整的页面代码
```

这是两个完全不同的层次。

### AI 编程工具的三个层次

| 层次 | 能力 | 代表工具 |
|------|------|---------|
| L1 代码补全 | 补全当前行/函数 | Copilot Tab 补全 |
| L2 对话式编程 | 通过对话生成代码 | Cursor Chat、Copilot Chat |
| L3 Agent 编程 | AI 自主规划和执行多步任务 | Cursor Composer、Windsurf Flow |

今天我们重点讲 L2 和 L3。

---

## Section 2：Cursor 深度解析（40 min）

### 为什么选 Cursor

Cursor 是目前最受欢迎的 AI 编程工具之一。它基于 VS Code，所以你的所有插件和配置都能用。

但它比 VS Code + Copilot 强在哪里？

**核心差异：上下文感知**

Copilot 只能看到当前文件。Cursor 可以看到整个项目。

这意味着：
- Cursor 知道你的项目结构
- Cursor 知道你用了哪些组件
- Cursor 知道你的 API 路由
- Cursor 知道你的类型定义

### Cursor 的四大核心功能

#### 1. Composer（多文件编辑）

这是 Cursor 最强大的功能。

```
Prompt: "创建一个用户认证模块，包含：
1. 登录页面 (app/login/page.tsx)
2. 注册页面 (app/register/page.tsx)
3. Server Actions (app/actions/auth.ts)
4. Zod 验证 (lib/validations/auth.ts)
5. 用户类型定义 (types/user.ts)"
```

Composer 会**同时创建/修改多个文件**，而且文件之间的引用关系是正确的。

这是 Copilot Chat 做不到的——它一次只能处理一个文件。

#### 2. Chat（上下文感知对话）

```
你：这个组件的性能有什么问题？
Cursor：我看到这个组件在每次渲染时都会重新创建 handleClick 函数，
建议用 useCallback 包裹。另外，UserList 组件没有用 React.memo，
当父组件重新渲染时会导致不必要的重渲染。
```

Cursor 能看到完整的组件代码和它的依赖，所以给出的建议更准确。

#### 3. Cmd+K（行内快速编辑）

选中一段代码，按 Cmd+K，输入修改指令：

```
选中一个 div，输入："改成 shadcn/ui 的 Card 组件，添加 hover 动画"
```

AI 直接在原位替换代码。

#### 4. Tab 补全

这个和 Copilot 类似，但 Cursor 的补全更准确，因为它有更多的上下文。

### .cursorrules 配置

这是让 Cursor 变强的关键。

```
# .cursorrules

## 技术栈
- React 19 + Next.js 15 App Router
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Zustand + TanStack Query
- React Hook Form + Zod

## 代码规范
- 使用函数式组件 + Hooks
- Props 类型使用 interface
- 导出使用命名导出
- 样式只用 Tailwind utility classes
- 优先使用 shadcn/ui 组件

## 文件路径
- UI 组件: components/ui/
- 业务组件: components/features/
- Hooks: hooks/
- Utils: lib/
- Types: types/

## 导入顺序
1. React 相关
2. 第三方库
3. 本地组件
4. 本地 hooks
5. 本地 utils
6. 类型定义

## 禁止
- 不使用 any
- 不写内联样式
- 不使用 CSS-in-JS
- 不直接修改 shadcn/ui 组件源码
- 不使用 useEffect 做数据请求
```

有了这个文件，Cursor 生成的代码会自动遵循你的项目规范。

---

## Section 3：AI Memory 管理（40 min）

### 为什么需要 Memory

AI 工具有一个致命问题：**每次对话都是"失忆"的**。

你昨天告诉 Cursor "我们用 Zustand 做状态管理"，今天它可能又给你生成 Redux 代码。

**Memory 就是解决这个问题的。**

### Memory 的三个层级

| 层级 | 存储位置 | 生命周期 | 用途 |
|------|----------|----------|------|
| 项目级 | AGENTS.md / .cursorrules | 永久 | 项目规范、技术栈 |
| 会话级 | 对话中主动告知 | 当前会话 | 当前任务上下文 |
| 个人级 | ~/.claude/memory/ | 永久 | 个人偏好 |

### 项目级 Memory：AGENTS.md

这是最重要的 Memory。放在项目根目录，所有 AI 工具都会读取。

```markdown
# 项目 AI 开发指南

## 项目概述
- 项目名称：AI Todo App
- 技术栈：Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui

## 技术决策历史
- 2026-03-15: 选择 Tailwind v4 而非 UnoCSS（生态更成熟）
- 2026-03-10: 使用 Zustand 而非 Redux（更轻量）

## 已知问题
- UserProfile 组件的性能问题已在 PR #123 修复
- Safari 浏览器的 Flexbox 问题需要 -webkit- 前缀

## 团队约定
- 所有 API 请求必须有错误处理
- 表单必须使用 React Hook Form + Zod
- 新功能必须有单元测试

## 禁止事项
- ❌ 不要使用 any 类型
- ❌ 不要直接修改 components/ui/ 下的组件
- ❌ 不要使用 useEffect 做数据请求
```

### 会话级 Memory：主动告知

在开始新任务时，主动告诉 AI 上下文：

```
好的示例：
"我正在重构用户认证模块。已完成登录页面（使用 React Hook Form + Zod），
现在要做注册页面。要求保持与登录页面一致的风格和验证逻辑。
登录页面的 Zod schema 在 lib/validations/auth.ts"

不好的示例：
"帮我做注册页面"  ← 缺少上下文
```

### 个人级 Memory

在 `~/.claude/memory/` 创建个人偏好文件：

```markdown
# preferences.md

## 代码风格
- 我喜欢函数式组件
- 我喜欢用 const 而非 let
- 我喜欢用解构赋值

## 工具偏好
- 包管理器：pnpm
- 测试框架：Vitest
- 状态管理：Zustand
```

### Memory 最佳实践

**✅ 应该记录的**：
1. 技术决策和原因
2. 已知问题和解决方案
3. 团队约定和规范
4. 重要的业务逻辑

**❌ 不应该记录的**：
1. 代码细节（AI 可以直接读代码）
2. 临时信息
3. 显而易见的事情

### Memory 维护

每月清理一次：
- 删除已过期的技术决策
- 更新已解决的问题
- 补充新的团队约定

---

## Section 4：Prompt Engineering（20 min）

### 高质量 Prompt 的结构

```
[角色] + [上下文] + [任务] + [约束] + [输出格式]
```

**示例**：

```
你是一个 React 前端工程师。
我们的项目使用 Next.js 15 + Tailwind v4 + shadcn/ui。
请创建一个用户设置页面，包含个人信息表单和通知设置。
要求：使用 React Hook Form + Zod 验证，支持暗色模式。
输出完整的 TypeScript 代码。
```

### 针对 Tailwind + shadcn/ui 的技巧

**技巧 1：指定组件**
```
"使用 shadcn/ui 的 Card、Form、Input、Button 组件"
```

**技巧 2：指定样式细节**
```
"使用 Tailwind 的 grid 布局，移动端单列，桌面端双列"
```

**技巧 3：指定交互**
```
"表单提交时显示 loading 状态，成功后显示 toast 提示"
```

---

## Section 5：横向对比（15 min）

| 工具 | 核心特色 | AI 模型 | 多文件编辑 | 价格 | 适用场景 |
|------|---------|---------|-----------|------|---------|
| **Cursor** | Composer 多文件 | Claude/GPT | ✅ | $20/月 | 全能型首选 |
| **Windsurf** | Flow 模式 | 多模型 | ✅ | $15/月 | 复杂重构 |
| **GitHub Copilot** | 代码补全 | GPT-4 | ❌ | $10/月 | 补全为主 |
| **Claude Code** | 终端集成 | Claude | ✅ | 按量付费 | 命令行用户 |
| **Zed** | 性能极致 | 多模型 | ❌ | 免费 | 追求速度 |
| **Replit Agent** | 全栈生成 | 多模型 | ✅ | 免费/付费 | 快速原型 |

### 如何选择

- **日常开发**：Cursor（最全能）
- **复杂重构**：Windsurf（Flow 模式更智能）
- **只需要补全**：GitHub Copilot（最便宜）
- **命令行重度用户**：Claude Code
- **追求速度**：Zed

---

## Closing（20 min）

### 今天的核心要点

1. **AI 编程工具不只是代码补全**：Composer 多文件编辑是杀手级功能
2. **.cursorrules 是必须配置的**：30 行配置，代码质量提升一个档次
3. **Memory 管理让 AI 越用越懂你**：项目级、会话级、个人级三层管理
4. **Prompt 质量决定输出质量**：学会写结构化的 Prompt

### 行动建议

1. **今天就做**：在项目中创建 .cursorrules 和 AGENTS.md
2. **这周做**：配置个人级 Memory（~/.claude/memory/）
3. **持续做**：每月维护和更新 Memory

### 下节课预告

下节课我们讲 **Vercel AI SDK**：
- 在前端应用中集成 AI 能力
- useChat Hook 和流式响应
- AI Agents 和工具调用

### Q&A

现在我们有 20 分钟的 Q&A 时间。

---

**演讲稿完成！**

**总时长**: 约 2.5 小时
- Opening: 10 min
- Section 1: 15 min
- Section 2: 40 min
- Section 3: 40 min
- Section 4: 20 min
- Section 5: 15 min
- Closing: 20 min
