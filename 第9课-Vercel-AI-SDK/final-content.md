# 前端 AI 功能集成：Vercel AI SDK
## 最终版演讲稿（融合版）

**演讲时长**: 2.5 小时
**风格**: 故事开场 + 技术深度 + 实践建议

---

## Opening Hook（10 min）

大家好，欢迎来到第 9 课。

前面几节课我们一直在讲"如何用 AI 帮我们写代码"。今天换个方向——**如何在我们的前端应用里集成 AI 能力**。

我先给大家看一个场景。

你们有没有用过那种客服聊天窗口？传统的客服系统，用户输入问题，后台匹配关键词，返回预设答案。体验很差对吧？

现在，越来越多的产品开始用 AI 驱动的客服。用户用自然语言提问，AI 实时理解并回答，还能调用后端 API 查询订单、修改信息。

**这种能力，前端工程师就能实现。**

不需要机器学习背景，不需要训练模型。你只需要一个 SDK——**Vercel AI SDK**。

今天我会带大家：
1. 理解前端 AI 功能的常见场景
2. 深入 Vercel AI SDK 的核心能力
3. 现场构建一个 AI 聊天界面
4. 对比其他 AI SDK 的优劣

---

## Section 1：前端 AI 功能的常见场景（15 min）

### 场景 1：AI 聊天机器人

最常见的场景。用户和 AI 对话，AI 实时回答。

关键技术点：
- 流式响应（打字机效果）
- 多轮对话（上下文记忆）
- 工具调用（查询数据库、调用 API）

### 场景 2：智能搜索

传统搜索：关键词匹配。
AI 搜索：语义理解，返回最相关的结果。

```tsx
// 传统搜索
const results = products.filter(p => p.name.includes(query))

// AI 搜索
const results = await ai.search({
  query: "适合送女朋友的礼物，预算 500 以内",
  context: products
})
```

### 场景 3：内容生成

- 自动生成产品描述
- 自动生成邮件模板
- 自动翻译

### 场景 4：表单智能填充

用户上传一张名片照片，AI 自动识别并填充表单字段。

**这些场景有一个共同点：前端需要和 AI 模型交互。**

而 Vercel AI SDK 就是为这个场景设计的。

---

## Section 2：Vercel AI SDK 深度解析（50 min）

### 核心设计理念

Vercel AI SDK 的核心理念是：**统一接口，多模型支持**。

你不需要为每个 AI 模型写不同的代码。一套代码，支持 OpenAI、Anthropic、Google、Mistral 等所有主流模型。

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'

// 用 OpenAI
const result1 = await generateText({
  model: openai('gpt-4o'),
  prompt: '你好'
})

// 切换到 Anthropic，只改一行
const result2 = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: '你好'
})
```

**一行代码切换模型。** 这对于 A/B 测试、成本优化、模型降级都非常有用。

### useChat Hook：最核心的 API

```tsx
'use client'

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "mb-4 p-3 rounded-lg",
              message.role === 'user'
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : "bg-gray-100 mr-auto max-w-[80%]"
            )}
          >
            {message.content}
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="输入消息..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          发送
        </Button>
      </form>
    </div>
  )
}
```

就这么简单。`useChat` 帮你处理了：
- 消息状态管理
- 流式响应
- 加载状态
- 错误处理

### 后端 API Route

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: '你是一个友好的助手，用中文回答问题。',
  })

  return result.toDataStreamResponse()
}
```

前端 `useChat` 会自动调用 `/api/chat`，后端用 `streamText` 生成流式响应。

### 流式响应的原理

为什么需要流式响应？

如果不用流式，用户需要等 AI 生成完所有内容才能看到结果。对于长回答，可能要等 10-20 秒。

用流式响应，AI 每生成一个 Token，就立即发送给前端。用户看到的是"打字机效果"，体验好很多。

```
传统方式：[等待 10 秒] → [一次性显示全部内容]
流式方式：[立即开始] → [逐字显示] → [完成]
```

### AI Agents 和工具调用

这是 Vercel AI SDK 最强大的功能之一。

你可以定义"工具"，让 AI 在对话中调用这些工具：

```typescript
// app/api/chat/route.ts
import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    tools: {
      getWeather: tool({
        description: '获取指定城市的天气',
        parameters: z.object({
          city: z.string().describe('城市名称'),
        }),
        execute: async ({ city }) => {
          // 调用天气 API
          const weather = await fetchWeather(city)
          return weather
        },
      }),
      searchProducts: tool({
        description: '搜索产品',
        parameters: z.object({
          query: z.string().describe('搜索关键词'),
          maxPrice: z.number().optional().describe('最高价格'),
        }),
        execute: async ({ query, maxPrice }) => {
          // 调用产品搜索 API
          return await searchProducts(query, maxPrice)
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
```

用户说"合肥今天天气怎么样"，AI 会自动调用 `getWeather` 工具，获取天气数据，然后用自然语言回答。

**这就是 AI Agent 的核心：AI 不只是聊天，还能执行操作。**

### 与 React Server Components 集成

```tsx
// app/page.tsx (Server Component)
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export default async function Page() {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: '用一句话介绍 React Server Components',
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI 生成的介绍</h1>
      <p className="text-gray-700">{text}</p>
    </div>
  )
}
```

在 Server Component 中直接调用 AI，不需要 API Route。

---

## Section 3：横向对比（20 min）

| SDK | 易用性 | 框架支持 | 流式支持 | 多模型 | 工具调用 | 适用场景 |
|-----|--------|----------|----------|--------|---------|---------|
| **Vercel AI SDK** | ⭐⭐⭐⭐⭐ | React/Next.js | 优秀 | ✅ 统一接口 | ✅ | Next.js 项目首选 |
| **LangChain.js** | ⭐⭐⭐ | 框架无关 | 良好 | ✅ | ✅ | 复杂 AI 工作流 |
| **OpenAI SDK** | ⭐⭐⭐⭐ | 框架无关 | 优秀 | ❌ 仅 OpenAI | ✅ | OpenAI 专属 |
| **Anthropic SDK** | ⭐⭐⭐⭐ | 框架无关 | 优秀 | ❌ 仅 Claude | ✅ | Claude 专属 |

### 什么时候用 Vercel AI SDK

- 你用 Next.js → **首选 Vercel AI SDK**
- 你需要多模型支持 → **首选 Vercel AI SDK**
- 你需要 useChat 这种开箱即用的 Hook → **首选 Vercel AI SDK**

### 什么时候用其他 SDK

- 你需要复杂的 AI 工作流（RAG、Chain）→ **LangChain.js**
- 你只用 OpenAI，需要最底层的控制 → **OpenAI SDK**
- 你只用 Claude，需要最新的 API 特性 → **Anthropic SDK**

---

## Section 4：实战演示（40 min）

### 实战 1：构建 AI 聊天界面

我现在现场演示，用 Vercel AI SDK + shadcn/ui 构建一个完整的 AI 聊天界面。

**Step 1：安装依赖**

```bash
pnpm add ai @ai-sdk/openai
```

**Step 2：创建 API Route**

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: '你是一个专业的前端开发助手。',
  })

  return result.toDataStreamResponse()
}
```

**Step 3：创建聊天组件**

用 shadcn/ui 的 Card、Input、Button、ScrollArea 组件构建界面。

**Step 4：添加 Markdown 渲染**

AI 的回答通常包含 Markdown 格式，我们需要渲染它：

```bash
pnpm add react-markdown
```

```tsx
import ReactMarkdown from 'react-markdown'

// 在消息渲染中
<ReactMarkdown className="prose prose-sm">
  {message.content}
</ReactMarkdown>
```

### 实战 2：AI Agent 调用工具

演示一个"智能客服"场景：
- 用户问"我的订单状态是什么"
- AI 自动调用 `getOrderStatus` 工具
- 返回订单信息

### 实战 3：流式生成 UI

Vercel AI SDK 还支持流式生成 React 组件：

```typescript
const result = streamUI({
  model: openai('gpt-4o'),
  messages,
  text: ({ content }) => <p>{content}</p>,
  tools: {
    showWeather: {
      description: '显示天气卡片',
      parameters: z.object({ city: z.string() }),
      generate: async function* ({ city }) {
        yield <WeatherSkeleton />
        const weather = await fetchWeather(city)
        return <WeatherCard data={weather} />
      },
    },
  },
})
```

AI 不只是返回文本，还能返回 React 组件！

---

## Closing（25 min）

### 今天的核心要点

1. **前端可以直接集成 AI 能力**：不需要 ML 背景
2. **Vercel AI SDK 是 Next.js 项目的首选**：统一接口、流式响应、工具调用
3. **useChat 是最核心的 API**：开箱即用的聊天功能
4. **AI Agent 是未来**：AI 不只是聊天，还能执行操作

### 行动建议

1. 在你的项目中试试 `useChat`，体验流式响应
2. 尝试定义一个工具，让 AI 调用你的 API
3. 思考你的产品中哪些场景可以用 AI 增强

### 下节课预告

下节课我们讲**工程化与全栈化**：
- Biome vs ESLint
- Next.js Server Actions
- tRPC 和 Prisma
- 技术选型决策框架

### Q&A

现在我们有 25 分钟的 Q&A 时间。

---

**演讲稿完成！**

**总时长**: 约 2.5 小时
- Opening: 10 min
- Section 1: 15 min
- Section 2: 50 min
- Section 3: 20 min
- Section 4: 40 min
- Closing: 25 min
