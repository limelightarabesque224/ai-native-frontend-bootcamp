# 第 6 课：AI 友好的项目架构 - Monorepo 与代码组织

## Opening Hook（10 min）

大家好，欢迎来到第 6 课。

今天我想先给大家讲一个真实的故事。上个月，我们团队接手了一个电商项目的重构任务。这个项目有 12 个微服务，分散在 12 个 Git 仓库里。前端有 3 个独立的仓库：主站、管理后台、移动端 H5。

我们想用 Cursor 来加速开发。结果第一天就遇到了问题：当我让 AI 帮我实现一个"用户下单后发送通知"的功能时，AI 需要理解订单服务、通知服务、用户服务三个仓库的代码。但 Cursor 一次只能打开一个项目。

我不得不在三个 IDE 窗口之间来回切换，手动复制代码给 AI 看。AI 生成的代码经常出现接口不匹配的问题，因为它看不到完整的上下文。

更糟糕的是，前端的组件库代码在一个独立的 npm 包里。每次修改组件，都要发布新版本，然后在三个前端项目里分别升级依赖。整个流程下来，一个小改动要花半天时间。

那天晚上，我们团队坐下来复盘：为什么我们的项目结构对 AI 这么不友好？

答案很简单：**AI 的工作方式和人类不一样。人类可以在脑子里记住多个仓库的上下文，可以跨窗口思考。但 AI 依赖的是你给它的上下文窗口。**

后来我们做了一个决定：把所有代码迁移到一个 Monorepo 里，使用 Turborepo + pnpm workspace。结果呢？

第二周，同样的需求，我在 Cursor 里直接说："实现用户下单后发送通知的功能"。AI 自动找到了 `packages/order`、`packages/notification`、`packages/user` 三个包，理解了它们之间的依赖关系，生成的代码一次就能跑通。

开发效率提升了 3 倍。

这就是今天这节课的核心主题：**如何设计 AI 友好的项目架构。**

我们会讲 Monorepo，但不只是讲 Monorepo。我们会讲如何通过合理的代码组织、命名约定、项目规范文件，让 AI 能够快速理解你的项目，生成高质量的代码。

准备好了吗？我们开始。

---

## Section 1：传统项目结构的 AI 困境（20 min）

### 1.1 按技术分层的问题

我们先来看一个典型的前端项目结构。这是我在很多公司见到的组织方式：

```
src/
├── components/
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── UserAvatar.tsx
│   └── OrderCard.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useOrder.ts
│   └── useUser.ts
├── services/
│   ├── authService.ts
│   ├── orderService.ts
│   └── userService.ts
├── store/
│   ├── authSlice.ts
│   ├── orderSlice.ts
│   └── userSlice.ts
└── pages/
    ├── LoginPage.tsx
    ├── OrderPage.tsx
    └── UserProfilePage.tsx
```

这种结构叫做"按技术分层"（Layer by Technology）。看起来很整洁，对吧？所有组件放一起，所有 hooks 放一起，所有 services 放一起。

但问题来了。假设你让 AI 帮你实现一个"订单列表页"的功能。AI 需要理解什么？

- `components/OrderCard.tsx` - 订单卡片组件
- `hooks/useOrder.ts` - 订单相关的 hooks
- `services/orderService.ts` - 订单 API 调用
- `store/orderSlice.ts` - 订单状态管理
- `pages/OrderPage.tsx` - 订单页面

这 5 个文件分散在 5 个不同的目录里。AI 需要跨目录理解它们之间的关系。

更糟糕的是，当你的项目变大，`components` 目录里有 50 个组件，`hooks` 目录里有 30 个 hooks。AI 在搜索相关代码时，需要遍历大量不相关的文件。

**这就是按技术分层对 AI 不友好的第一个原因：相关的代码被物理隔离了。**

### 1.2 单仓巨石的问题

我们再看另一个极端：把所有代码都放在一个仓库里，但没有任何模块化。

```
src/
├── App.tsx (3000 行)
├── utils.ts (2000 行)
├── api.ts (1500 行)
├── types.ts (1000 行)
└── ... (100+ 个文件)
```

这种项目我见过太多了。一个 `utils.ts` 文件里塞了几十个工具函数，从日期格式化到加密解密，什么都有。

当你让 AI 帮你修改一个功能时，AI 需要加载整个 `utils.ts` 文件到上下文里。但其中 90% 的代码都是不相关的。

**这就是单仓巨石的问题：上下文过大，噪音太多。**

AI 的上下文窗口是有限的。Claude 3.5 Sonnet 有 200K tokens 的上下文窗口，看起来很大，对吧？但一个中型项目的代码量轻松超过这个数字。

当 AI 的上下文被无关代码占满时，它就无法深入理解你真正需要修改的部分。

### 1.3 多仓分散的问题

最后，我们来看多仓分散的问题。这是我在开头故事里提到的场景。

```
repo-1: frontend-main/
repo-2: frontend-admin/
repo-3: frontend-mobile/
repo-4: shared-components/
repo-5: shared-utils/
```

这种结构的问题更明显：**AI 无法跨仓库推理。**

当你在 `frontend-main` 里使用 `shared-components` 的组件时，AI 看不到组件的源码。它只能看到类型定义（如果你有的话）。

结果就是，AI 生成的代码经常出现：
- 传错了 props
- 调用了不存在的方法
- 使用了已经废弃的 API

你不得不手动去 `shared-components` 仓库里查看文档，然后回来修改代码。

**这完全违背了使用 AI 的初衷：提高效率。**

### 1.4 小结

我们总结一下传统项目结构的三大问题：

1. **按技术分层**：相关代码被物理隔离，AI 需要跨目录理解
2. **单仓巨石**：上下文过大，噪音太多，AI 无法聚焦
3. **多仓分散**：AI 无法跨仓库推理，缺少完整上下文

那么，什么样的项目结构对 AI 友好呢？

答案是：**Monorepo + 功能切片（Feature Slicing）**。

---

## Section 2：Turborepo + pnpm workspace（40 min）

### 2.1 为什么 Monorepo 更 AI 友好

Monorepo 的核心思想很简单：把所有相关的代码放在一个仓库里，但通过合理的模块化来组织。

看一个典型的 Monorepo 结构：

```
my-project/
├── apps/
│   ├── web/              # 主站
│   ├── admin/            # 管理后台
│   └── mobile/           # 移动端 H5
├── packages/
│   ├── ui/               # UI 组件库
│   ├── utils/            # 工具函数
│   ├── config/           # 共享配置
│   └── types/            # 类型定义
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

为什么这种结构对 AI 友好？三个原因：

**1. 完整的上下文**

所有代码都在一个仓库里。当你在 `apps/web` 里使用 `packages/ui` 的组件时，AI 可以直接看到组件的源码。不需要跨仓库查找。

**2. 清晰的边界**

每个 package 都有明确的职责。`packages/ui` 只包含 UI 组件，`packages/utils` 只包含工具函数。AI 可以快速定位到相关代码。

**3. 局部上下文**

当你让 AI 修改 `packages/ui` 的代码时，AI 只需要加载这个 package 的代码，不需要加载整个项目。上下文更聚焦，生成的代码质量更高。

这就是 Monorepo 的魔力：**在保持代码集中的同时，提供清晰的模块边界。**

### 2.2 功能切片（Feature Slicing）

但光有 Monorepo 还不够。我们还需要一个好的代码组织方式。

传统的按技术分层，我们已经看到了它的问题。那么，什么是更好的方式呢？

答案是：**功能切片（Feature Slicing）**。

功能切片的核心思想是：**按业务功能组织代码，而不是按技术层次。**

我们来看一个例子。假设你有一个电商项目，有三个核心功能：用户管理、订单管理、商品管理。

按技术分层的结构：

```
src/
├── components/
│   ├── UserAvatar.tsx
│   ├── OrderCard.tsx
│   └── ProductCard.tsx
├── hooks/
│   ├── useUser.ts
│   ├── useOrder.ts
│   └── useProduct.ts
└── services/
    ├── userService.ts
    ├── orderService.ts
    └── productService.ts
```

功能切片的结构：

```
src/
├── features/
│   ├── user/
│   │   ├── components/
│   │   │   └── UserAvatar.tsx
│   │   ├── hooks/
│   │   │   └── useUser.ts
│   │   ├── services/
│   │   │   └── userService.ts
│   │   └── index.ts
│   ├── order/
│   │   ├── components/
│   │   │   └── OrderCard.tsx
│   │   ├── hooks/
│   │   │   └── useOrder.ts
│   │   ├── services/
│   │   │   └── orderService.ts
│   │   └── index.ts
│   └── product/
│       ├── components/
│       │   └── ProductCard.tsx
│       ├── hooks/
│       │   └── useProduct.ts
│       ├── services/
│       │   └── productService.ts
│       └── index.ts
```

看到区别了吗？

在功能切片的结构里，所有和"订单"相关的代码都在 `features/order` 目录下。组件、hooks、services，全部在一起。

当你让 AI 实现一个订单相关的功能时，AI 只需要关注 `features/order` 这一个目录。所有相关的代码都在这里，不需要跨目录查找。

**这就是功能切片对 AI 友好的核心原因：相关的代码物理上聚合在一起。**

### 2.3 Turborepo 深度解析

好，现在我们来看具体的工具。今天我们重点讲 Turborepo。

Turborepo 是 Vercel 开发的 Monorepo 构建工具。它的核心优势有三个：

1. **任务编排（Task Orchestration）**
2. **Remote Caching**
3. **增量构建（Incremental Builds）**

我们一个一个来看。

#### 2.3.1 任务编排

在 Monorepo 里，你有多个 packages。每个 package 都有自己的构建任务：`build`、`test`、`lint` 等。

问题是：这些任务之间有依赖关系。

比如，`apps/web` 依赖 `packages/ui`。所以你必须先构建 `packages/ui`，再构建 `apps/web`。

如果手动管理这些依赖，会非常麻烦。你需要写一堆脚本，确保任务按正确的顺序执行。

Turborepo 帮你自动处理这些依赖。你只需要在 `turbo.json` 里声明任务的依赖关系：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}
```

这里的 `^build` 是什么意思？`^` 表示"依赖的 packages 的 build 任务"。

也就是说，当你运行 `turbo run build` 时，Turborepo 会：
1. 分析依赖图
2. 先构建所有被依赖的 packages
3. 再构建当前 package
4. 并行执行没有依赖关系的任务

这就是任务编排。你不需要关心执行顺序，Turborepo 会自动帮你处理。

#### 2.3.2 Remote Caching

Turborepo 的第二个杀手级特性是 Remote Caching。

想象一个场景：你的团队有 10 个开发者。每个人都在本地构建项目。如果 `packages/ui` 没有变化，那么每个人都在重复构建相同的代码。

这是巨大的浪费。

Turborepo 的 Remote Caching 解决了这个问题。它的工作原理是：

1. 当你构建一个 package 时，Turborepo 会计算输入文件的哈希值
2. 如果缓存里有相同哈希值的构建结果，直接使用缓存
3. 如果没有，执行构建，并把结果上传到远程缓存

这样，团队里的第一个人构建了 `packages/ui`，其他人就可以直接使用缓存，不需要重复构建。

在 CI/CD 环境里，这个特性更有价值。你可以在不同的 CI job 之间共享缓存，大幅减少构建时间。

配置 Remote Caching 很简单：

```bash
# 登录 Vercel（Turborepo 的官方缓存服务）
npx turbo login

# 链接到你的项目
npx turbo link
```

就这么简单。Turborepo 会自动处理缓存的上传和下载。

#### 2.3.3 增量构建

Turborepo 的第三个特性是增量构建。

当你修改了一个文件，Turborepo 只会重新构建受影响的 packages。

比如，你修改了 `packages/utils` 的一个文件。Turborepo 会：
1. 重新构建 `packages/utils`
2. 重新构建所有依赖 `packages/utils` 的 packages
3. 不构建其他无关的 packages

这大幅减少了构建时间。在大型 Monorepo 里，这个特性可以把构建时间从几十分钟减少到几分钟。

### 2.4 pnpm workspace

讲完 Turborepo，我们来看 pnpm workspace。

pnpm 是一个快速、节省磁盘空间的包管理器。它的 workspace 功能是 Monorepo 的基础。

#### 2.4.1 硬链接

pnpm 的核心优势是硬链接（Hard Links）。

传统的 npm 和 yarn，每个项目都有自己的 `node_modules`。如果你有 10 个项目，每个项目都安装了 React，那么你的磁盘上就有 10 份 React 的副本。

pnpm 不一样。它把所有的包都存储在一个全局的 store 里（通常在 `~/.pnpm-store`）。然后在每个项目的 `node_modules` 里创建硬链接。

硬链接是什么？简单来说，就是同一个文件的多个入口。它们指向磁盘上的同一块数据。

这样，无论你有多少个项目，React 在磁盘上只有一份副本。

在 Monorepo 里，这个优势更明显。假设你有 10 个 packages，每个都依赖 React。用 npm，你需要 10 份 React。用 pnpm，只需要 1 份。

#### 2.4.2 workspace 协议

pnpm workspace 的另一个重要特性是 workspace 协议。

在 Monorepo 里，packages 之间会互相依赖。比如，`apps/web` 依赖 `packages/ui`。

传统的做法是在 `apps/web/package.json` 里写：

```json
{
  "dependencies": {
    "@myproject/ui": "1.0.0"
  }
}
```

但这有个问题：每次你修改 `packages/ui`，都需要发布新版本，然后在 `apps/web` 里升级依赖。

pnpm 的 workspace 协议解决了这个问题：

```json
{
  "dependencies": {
    "@myproject/ui": "workspace:*"
  }
}
```

`workspace:*` 表示"使用 workspace 里的最新版本"。

这样，你修改 `packages/ui` 后，`apps/web` 会自动使用最新的代码。不需要发布，不需要升级依赖。

#### 2.4.3 实战配置

让我们看一个完整的配置示例。

首先，创建 `pnpm-workspace.yaml`：

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

这告诉 pnpm，`apps` 和 `packages` 目录下的所有子目录都是 workspace 的一部分。

然后，在根目录的 `package.json` 里：

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

在 `packages/ui/package.json` 里：

```json
{
  "name": "@myproject/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch"
  }
}
```

在 `apps/web/package.json` 里：

```json
{
  "name": "web",
  "version": "1.0.0",
  "dependencies": {
    "@myproject/ui": "workspace:*",
    "react": "^18.3.0",
    "next": "^15.0.0"
  }
}
```

就这么简单。现在你可以在根目录运行：

```bash
pnpm install
pnpm build
pnpm dev
```

Turborepo 会自动处理任务编排，pnpm 会自动处理依赖管理。

---

## Section 3：AI 友好的文件结构约定（25 min）

### 3.1 命名约定

好，现在我们有了 Monorepo 的基础架构。但这还不够。

要让 AI 真正理解你的项目，你需要建立一套清晰的命名约定。

为什么命名约定这么重要？因为 AI 是通过文件名和目录名来理解代码结构的。

举个例子。假设你有两个文件：

```
utils.ts
userAuthenticationHelpers.ts
```

哪个文件名更 AI 友好？

显然是第二个。`userAuthenticationHelpers.ts` 这个名字告诉 AI：这个文件包含用户认证相关的辅助函数。

而 `utils.ts` 呢？AI 完全不知道里面有什么。它可能包含日期格式化，可能包含加密解密，可能包含任何东西。

**好的命名约定应该遵循这些原则：**

1. **描述性（Descriptive）**：文件名应该清楚地描述内容
2. **一致性（Consistent）**：整个项目使用相同的命名风格
3. **层次性（Hierarchical）**：通过目录结构表达层次关系

让我们看一些具体的例子。

#### 3.1.1 组件命名

```
# ❌ 不好的命名
Button.tsx
Modal.tsx
Card.tsx

# ✅ 好的命名
Button.tsx              # 基础组件可以简单命名
UserProfileCard.tsx     # 业务组件应该包含业务含义
OrderConfirmModal.tsx   # 清楚地表达用途
```

#### 3.1.2 Hook 命名

```
# ❌ 不好的命名
useData.ts
useFetch.ts

# ✅ 好的命名
useUserProfile.ts       # 清楚地表达获取什么数据
useOrderList.ts         # 业务含义明确
useAuthToken.ts         # 功能清晰
```

#### 3.1.3 工具函数命名

```
# ❌ 不好的命名
utils/
├── index.ts            # 什么都有

# ✅ 好的命名
utils/
├── date/
│   ├── formatDate.ts
│   └── parseDate.ts
├── string/
│   ├── capitalize.ts
│   └── truncate.ts
└── validation/
    ├── validateEmail.ts
    └── validatePhone.ts
```

看到区别了吗？好的命名约定让 AI 可以通过文件名快速定位到相关代码。

### 3.2 目录结构约定

除了命名，目录结构也很重要。

我推荐使用"功能切片 + 分层"的混合结构：

```
packages/
├── features/           # 业务功能
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── order/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   └── user/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── index.ts
├── ui/                 # 通用 UI 组件
│   ├── Button/
│   ├── Input/
│   └── Modal/
├── utils/              # 通用工具函数
│   ├── date/
│   ├── string/
│   └── validation/
└── config/             # 配置文件
    ├── api.ts
    └── constants.ts
```

这种结构的优势是：

1. **业务功能聚合**：所有和"订单"相关的代码都在 `features/order` 里
2. **通用代码分离**：UI 组件、工具函数等通用代码独立出来
3. **层次清晰**：每个 feature 内部按技术分层，但 feature 之间按业务分离

### 3.3 AGENTS.md / CLAUDE.md / .cursorrules

现在，我们来讲今天最重要的一个概念：**项目规范文件**。

这些文件是专门写给 AI 看的。它们告诉 AI：这个项目是怎么组织的，有哪些约定，应该怎么生成代码。

不同的 AI 工具有不同的规范文件：

- **AGENTS.md**：通用的 AI 指令文件，适用于所有 AI 工具
- **CLAUDE.md**：专门给 Claude 看的指令文件
- **.cursorrules**：Cursor 专用的规则文件

让我们看一个 `AGENTS.md` 的例子：

```markdown
# AI Agent Instructions

## Project Overview
This is an e-commerce platform built with Next.js, React, and TypeScript.

## Architecture
- Monorepo managed by Turborepo + pnpm workspace
- Feature-sliced design: code organized by business features
- Shared packages: ui, utils, config, types

## Code Organization
- `apps/web`: Main website
- `apps/admin`: Admin dashboard
- `packages/features/*`: Business features (auth, order, user, product)
- `packages/ui`: Shared UI components
- `packages/utils`: Utility functions

## Naming Conventions
- Components: PascalCase (e.g., UserProfileCard.tsx)
- Hooks: camelCase with 'use' prefix (e.g., useUserProfile.ts)
- Utils: camelCase (e.g., formatDate.ts)
- Types: PascalCase with 'Type' or 'Interface' suffix

## Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind CSS for styling
- Follow ESLint and Prettier rules

## When Adding New Features
1. Create a new directory under `packages/features/`
2. Include: components/, hooks/, services/, types/, index.ts
3. Export public APIs through index.ts
4. Add dependencies in package.json with workspace protocol

## Testing
- Unit tests: Vitest
- E2E tests: Playwright
- Test files: *.test.ts or *.spec.ts
```

