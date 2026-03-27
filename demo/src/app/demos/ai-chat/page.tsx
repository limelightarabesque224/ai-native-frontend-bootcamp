'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

// 模拟 AI 聊天（不依赖 API key）
// 实际使用时替换为 useChat from 'ai/react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const mockResponses = [
  '你好！我是 AI 助手。这个演示展示了 Vercel AI SDK 的 useChat Hook 如何工作。',
  'Vercel AI SDK 的核心是 `useChat` Hook，它帮你处理：消息状态管理、流式响应、加载状态和错误处理。',
  '使用 shadcn/ui + Tailwind CSS 构建 AI 聊天界面非常简单，只需要 Card、Input、Button、ScrollArea 这几个组件。',
  '流式响应让用户看到"打字机效果"，而不是等待 AI 生成完所有内容。这是通过 Server-Sent Events (SSE) 实现的。',
  '你可以定义"工具"让 AI 调用，比如查询天气、搜索产品、操作数据库。这就是 AI Agent 的核心。',
]

export default function AiChatDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // 模拟 AI 响应延迟
    await new Promise((resolve) => setTimeout(resolve, 800))

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: mockResponses[messages.length % mockResponses.length],
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary mb-8 block">
        ← 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-2">第 9 课：AI 聊天</h1>
      <p className="text-muted-foreground mb-8">
        Vercel AI SDK — useChat Hook 演示（模拟模式）
      </p>

      {/* 聊天界面 */}
      <div className="rounded-lg border shadow-sm">
        {/* 消息区域 */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg mb-2">AI 助手</p>
              <p className="text-sm">输入消息开始对话</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'max-w-[80%] rounded-lg p-3 text-sm',
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-secondary'
              )}
            >
              {message.content}
            </div>
          ))}

          {isLoading && (
            <div className="max-w-[80%] rounded-lg bg-secondary p-3 text-sm">
              <span className="animate-pulse">AI 正在思考...</span>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            发送
          </button>
        </form>
      </div>

      {/* 代码说明 */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">实际代码</h2>
        <p className="text-sm text-muted-foreground">
          实际项目中使用 Vercel AI SDK 的 useChat Hook（需要 API key）：
        </p>
        <pre className="bg-secondary rounded-lg p-4 text-sm overflow-x-auto">
          {`'use client'
import { useChat } from 'ai/react'

export function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading
  } = useChat() // 自动调用 /api/chat

  return (
    <div>
      {messages.map(m => (
        <div key={m.id} className={cn(
          "p-3 rounded-lg",
          m.role === 'user'
            ? "bg-primary text-white ml-auto"
            : "bg-secondary"
        )}>
          {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input}
          onChange={handleInputChange} />
        <button type="submit">发送</button>
      </form>
    </div>
  )
}`}
        </pre>

        <pre className="bg-secondary rounded-lg p-4 text-sm overflow-x-auto">
          {`// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  })

  return result.toDataStreamResponse()
}`}
        </pre>
      </div>
    </div>
  )
}
