# 工程化与全栈化
## 最终版演讲稿（融合版）

**演讲时长**: 2.5 小时
**风格**: 故事开场 + 技术深度 + 实践建议

---

## Opening Hook（10 min）

大家好，欢迎来到第 10 课。

今天我想先问大家一个问题：你们有没有发现，当你用 AI 写代码的时候，如果项目配置了 ESLint + Prettier，AI 生成的代码经常会有格式问题？然后你还得手动修复，或者再让 AI 修一遍？

这个问题我遇到太多次了。直到我换成了 Biome，这个问题基本消失了。

为什么？因为 Biome 的设计理念就是"AI 友好"——配置更简单，错误信息更清晰，而且速度快了 **100 倍**。

这就是我们今天要讨论的核心主题：**AI 时代的工程化**。

另外，我还要讲一个更大的趋势：**前端全栈化**。Next.js Server Actions 让前端工程师可以直接写后端逻辑，tRPC 让前后端类型安全贯通，Prisma 让数据库操作变得 AI 友好。

这些加在一起，意味着：**AI 可以在一个代码库里理解你的完整数据流**。

---

## Section 1：AI 驱动的 CI/CD（20 min）

### 传统 CI/CD 的问题

传统的 CI/CD 流水线：
1. 代码提交
2. 运行所有测试（可能 30 分钟）
3. 构建（可能 10 分钟）
4. 部署

**问题**：每次都运行所有测试，太慢了。

### 智能测试选择

AI 可以分析你的代码变更，只运行受影响的测试：

```yaml
# .github/workflows/ci.yml
- name: Smart Test Selection
  run: |
    # 分析变更文件
    CHANGED_FILES=$(git diff --name-only HEAD~1)
    # AI 分析影响范围，只运行相关测试
    turbo run test --filter=...[HEAD~1]
```

Turborepo 的 `--filter` 就是这个思路：只构建和测试变更的包。

### AI Code Review 集成

```yaml
# 在 PR 中自动运行 AI Code Review
- name: AI Code Review
  uses: coderabbitai/ai-pr-reviewer@latest
  with:
    model: claude-sonnet-4-20250514
```

AI 自动审查代码，发现潜在问题，提出改进建议。

---

## Section 2：代码质量工具（30 min）

### Biome vs ESLint + Prettier

这是今天的重头戏。

**ESLint + Prettier 的问题**：

```json
// .eslintrc.json - 配置复杂
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["react", "@typescript-eslint", "import"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "import/order": ["error", { "groups": [...] }]
  }
}
```

```json
// .prettierrc - 又一个配置文件
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

两个工具，两个配置文件，还经常冲突。AI 生成的代码经常不符合这些规则。

**Biome 的方案**：

```json
// biome.json - 一个文件搞定
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

**对比**：

| 特性 | ESLint + Prettier | Biome |
|------|------------------|-------|
| 速度 | 基准 | **100x 更快** |
| 配置文件 | 2-3 个 | 1 个 |
| 冲突问题 | 经常冲突 | 不存在 |
| AI 友好度 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 错误信息 | 一般 | 清晰详细 |
| 语言 | JavaScript | Rust |

**为什么 Biome 更 AI 友好**：
1. 配置简单，AI 容易理解
2. 错误信息清晰，AI 容易修复
3. 速度快，不影响开发体验

### TypeScript 严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

**为什么严格模式对 AI 友好**：
- 类型信息越完整，AI 生成的代码越准确
- 严格模式强制你写出类型完整的代码
- AI 可以利用类型信息推理代码意图

---

## Section 3：前端全栈化趋势（40 min）

### 为什么全栈化是趋势

传统前端开发：
```
前端（React）→ API 层（REST/GraphQL）→ 后端（Node/Java）→ 数据库
```

AI 需要理解 4 个层次，跨越多个代码库。

全栈化之后：
```
Next.js（前端 + 后端 + API）→ 数据库
```

AI 只需要理解 1 个代码库，效率大幅提升。

### Next.js Server Actions

```tsx
// app/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function createUser(formData: FormData) {
  const data = createUserSchema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  })

  const user = await prisma.user.create({ data })
  return user
}
```

```tsx
// app/page.tsx
import { createUser } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Page() {
  return (
    <form action={createUser} className="space-y-4 max-w-md mx-auto p-8">
      <Input name="name" placeholder="姓名" />
      <Input name="email" type="email" placeholder="邮箱" />
      <Button type="submit">创建用户</Button>
    </form>
  )
}
```

**前端直接调用后端逻辑，不需要写 API Route。**

AI 可以在一个文件里看到完整的数据流：用户输入 → 验证 → 数据库操作。

### tRPC：端到端类型安全

```typescript
// server/routers/user.ts
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({ where: { id: input.id } })
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.user.create({ data: input })
    }),
})
```

```tsx
// 前端调用，完全类型安全
const user = trpc.user.getById.useQuery({ id: '123' })
// user 的类型自动推导，不需要手动定义
```

**为什么 tRPC 对 AI 友好**：
- 类型从后端自动传递到前端
- AI 可以理解完整的数据流
- 不需要手写 API 文档

### Prisma：AI 友好的 ORM

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

**为什么 Prisma 对 AI 友好**：
- Schema 即文档，AI 一眼看懂数据结构
- 类型自动生成
- 查询 API 直观

### 完整的全栈技术栈

```
Next.js 15 (App Router)
  → Server Actions (后端逻辑)
  → Prisma (数据库)
  → shadcn/ui + Tailwind (前端 UI)
  → Vercel AI SDK (AI 功能)
  → Biome (代码质量)
  → Turborepo (Monorepo)
```

**AI 可以在一个代码库里理解你的完整应用。**

---

## Section 4：常用 Skills 和 MCP 工具（20 min）

除了代码质量和全栈化，还有一些工具可以提升 AI 开发效率：

| 工具 | 类型 | 用途 |
|------|------|------|
| GitHub MCP | MCP | 代码仓库操作、PR 管理 |
| Linear MCP | MCP | 任务管理集成 |
| Sentry MCP | MCP | 错误监控和定位 |
| Context7 MCP | MCP | 文档查询 |
| Firecrawl MCP | MCP | 网页抓取 |

这些工具让 AI 不只是写代码，还能管理项目、监控错误、查询文档。

---

## Section 5：技术选型决策框架（20 min）

### AI 友好性评估矩阵

| 评估维度 | 权重 | 评估标准 |
|----------|------|----------|
| 代码可读性 | 高 | AI 能否一眼理解代码意图 |
| 源码可见性 | 高 | AI 能否直接访问和修改源码 |
| 语义内联度 | 中 | 样式/逻辑是否与结构内联 |
| 组合性 | 中 | 是否支持灵活组合 |
| 生态 AI 工具 | 中 | 是否有配套的 AI 工具 |
| 文档质量 | 低 | AI 训练数据中的覆盖度 |

### 决策流程

1. 列出候选技术
2. 用评估矩阵打分
3. 结合团队现状和项目需求
4. 制定迁移计划

---

## Closing（20 min）

### 今天的核心要点

1. **Biome > ESLint + Prettier**：更快、更简单、更 AI 友好
2. **TypeScript 严格模式**：帮助 AI 理解类型
3. **前端全栈化是趋势**：Server Actions + tRPC + Prisma
4. **全栈化对 AI 友好**：一个代码库，完整数据流

### 行动建议

1. 把项目的 ESLint + Prettier 迁移到 Biome
2. 开启 TypeScript 严格模式
3. 在新项目中尝试 Server Actions
4. 用评估矩阵评估你的技术栈

### 下节课预告

下节课是我们的最后一课：**全链路整合与未来展望**。我会把所有知识串联起来，展示完整的 AI-Native 工作流。

### Q&A

现在我们有 20 分钟的 Q&A 时间。

---

**演讲稿完成！**

**总时长**: 约 2.5 小时
- Opening: 10 min
- Section 1: 20 min
- Section 2: 30 min
- Section 3: 40 min
- Section 4: 20 min
- Section 5: 20 min
- Closing: 20 min
