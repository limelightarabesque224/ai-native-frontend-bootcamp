# Design to Code（下）：AI 代码生成工具实战
## 最终版演讲稿（融合版）

**演讲时长**: 2.5 小时
**风格**: 故事开场 + 技术深度 + 实践建议

---

## Opening Hook（10 min）

大家好，欢迎来到第 5 课。

上节课我们讲了设计工具的 AI 革命——Figma AI、Penpot、Pencil.dev。今天我们换个角度，不从设计工具出发，而是从**代码生成工具**出发。

我先给大家看一个场景。

产品经理发了一张竞品截图到群里，说："我们也做一个类似的页面，明天要。"

**传统做法**：
1. 设计师出设计稿（半天）
2. 开发者还原设计稿（1-2 天）
3. 反复对稿修改（半天）
4. 总计：2-3 天

**AI-Native 做法**：
1. 把截图丢给 v0.dev
2. v0.dev 生成 React + Tailwind + shadcn/ui 代码
3. 开发者审查和调整
4. 总计：2-3 小时

我现在就给大家演示。

（打开 v0.dev，上传竞品截图）

大家看，v0.dev 生成的代码：
- 使用了 shadcn/ui 的 Card、Button、Badge 组件
- 样式全部用 Tailwind
- 响应式布局
- 代码质量很高，基本不用改

**这就是今天要讲的核心：AI 代码生成工具如何改变前端开发。**

---

## Section 1：AI 代码生成工具的定位（15 min）

### 不是替代，是加速

首先要明确一点：**AI 代码生成工具不是替代开发者，而是加速从原型到生产的过程。**

你可以把它理解为一个"超级初稿生成器"：
- 它生成 80% 的代码
- 你负责审查和优化剩下的 20%

### 角色转变

传统前端开发者的工作：
```
需求 → 设计稿 → 写代码 → 调试 → 上线
         ↑ 大部分时间花在这里
```

AI 时代前端开发者的工作：
```
需求 → AI 生成代码 → 审查代码 → 优化 → 上线
                      ↑ 大部分时间花在这里
```

**从"写代码"变成"审代码"。**

### 生成代码的质量评估标准

不是所有 AI 生成的代码都能用。评估标准：

| 维度 | 好的生成 | 差的生成 |
|------|---------|---------|
| 技术栈 | 使用指定的技术栈 | 混用不同技术栈 |
| 组件 | 使用 shadcn/ui | 自己写原生 HTML |
| 样式 | Tailwind utility | 内联 style 或自定义 CSS |
| 类型 | TypeScript 完整 | any 满天飞 |
| 可访问性 | 语义化标签 | div 套 div |
| 响应式 | 移动端适配 | 只有桌面端 |

---

## Section 2：v0.dev 深度解析（40 min）

### 核心能力

v0.dev 是 Vercel 出品的 AI 代码生成工具，专门为 React + Tailwind + shadcn/ui 优化。

**能力 1：从文字描述生成代码**

```
Prompt: "创建一个现代的登录页面，包含邮箱和密码输入框，
社交登录按钮（Google、GitHub），记住我复选框，
忘记密码链接。使用 shadcn/ui 组件，支持暗色模式。"
```

v0.dev 会生成完整的组件代码，包含：
- shadcn/ui 的 Card、Input、Button、Checkbox
- Tailwind 样式
- 暗色模式支持
- 响应式布局

**能力 2：从图片生成代码（截图转代码）**

上传一张设计稿截图或竞品截图，v0.dev 会：
1. 分析图片中的 UI 元素
2. 识别布局结构
3. 生成对应的 React 代码

**能力 3：迭代式修改**

生成代码后，你可以用自然语言修改：
- "把按钮改成圆角"
- "添加一个加载状态"
- "改成暗色主题"
- "让卡片在移动端竖排"

v0.dev 会在现有代码基础上修改，而不是重新生成。

### Prompt 技巧

**技巧 1：明确指定技术栈**

```
❌ "创建一个登录页面"
✅ "创建一个登录页面，使用 React + Tailwind CSS + shadcn/ui"
```

**技巧 2：描述视觉细节**

```
❌ "创建一个卡片"
✅ "创建一个卡片，白色背景，圆角 12px，轻微阴影，
    hover 时阴影加深，包含标题、描述和操作按钮"
```

**技巧 3：指定响应式行为**

```
✅ "移动端单列布局，平板双列，桌面三列，使用 CSS Grid"
```

**技巧 4：指定交互状态**

```
✅ "按钮有 hover、active、disabled、loading 四种状态"
```

**技巧 5：分步生成**

复杂页面不要一次性生成，分步来：
1. 先生成整体布局
2. 再逐个完善每个区域
3. 最后添加交互和动画

### 生成代码示例

我让 v0.dev 生成一个定价页面：

```
Prompt: "创建一个 SaaS 定价页面，三个套餐（基础版、专业版、企业版），
专业版标记为'最受欢迎'。每个套餐包含价格、功能列表、CTA 按钮。
支持月/年切换。使用 shadcn/ui 组件。"
```

v0.dev 生成的代码：

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Check } from 'lucide-react'

const plans = [
  {
    name: '基础版',
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: ['5 个项目', '10GB 存储', '基础分析', '邮件支持'],
    popular: false,
  },
  {
    name: '专业版',
    monthlyPrice: 79,
    yearlyPrice: 790,
    features: ['无限项目', '100GB 存储', '高级分析', 'AI 助手', '优先支持'],
    popular: true,
  },
  {
    name: '企业版',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: ['无限一切', '1TB 存储', '自定义分析', 'AI 助手', '专属客服', 'SLA 保障'],
    popular: false,
  },
]

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">选择适合你的方案</h1>
        <p className="text-gray-600 mb-8">所有方案都包含 14 天免费试用</p>
        <div className="flex items-center justify-center gap-3">
          <span className={!isYearly ? 'font-semibold' : 'text-gray-500'}>月付</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={isYearly ? 'font-semibold' : 'text-gray-500'}>
            年付 <Badge variant="secondary">省 20%</Badge>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative",
              plan.popular && "border-2 border-primary shadow-lg scale-105"
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                最受欢迎
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ¥{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-gray-500">/{isYearly ? '年' : '月'}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
              >
                开始试用
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**一次生成，代码质量很高。** 使用了 shadcn/ui 组件、Tailwind 样式、响应式布局、月/年切换逻辑。

---

## Section 3：横向对比其他 AI 生成工具（35 min）

### Bolt.new

**定位**：全栈应用原型工具

**核心特色**：
- 在线 IDE 环境（StackBlitz）
- 支持全栈开发（前端 + 后端 + 数据库）
- 实时预览
- 一键部署

**适用场景**：
- 快速搭建全栈原型
- 需要后端逻辑的项目
- 演示和 POC

**代码示例**：

```
Prompt: "创建一个待办事项应用，包含：
- 添加/删除/完成任务
- 数据持久化（SQLite）
- 用户认证
使用 Next.js + Prisma + shadcn/ui"
```

Bolt.new 会生成完整的全栈应用，包含前端、后端、数据库。

### Lovable

**定位**：端到端应用生成

**核心特色**：
- 从描述生成完整应用
- 包含后端和数据库（Supabase）
- 自动部署
- 支持协作编辑

**适用场景**：
- 非技术人员快速搭建应用
- MVP 快速验证
- 内部工具

### Screenshot to Code

**定位**：截图转代码

**核心特色**：
- 上传截图，生成 HTML/React/Vue 代码
- 支持多种框架
- 开源免费

**适用场景**：
- 快速还原设计稿
- 竞品分析
- 原型制作

### Builder.io Visual Copilot

**定位**：Figma 插件

**核心特色**：
- 直接在 Figma 中使用
- 生成多种框架的代码
- 与设计工作流无缝集成

**适用场景**：
- 设计师和开发者协作
- Figma 重度用户

### 对比表格

| 工具 | 技术栈 | 代码质量 | 全栈 | 价格 | 适用场景 |
|------|--------|---------|------|------|---------|
| **v0.dev** | React + Tailwind + shadcn | ⭐⭐⭐⭐⭐ | ❌ | 免费/付费 | 组件/页面生成 |
| **Bolt.new** | 多框架 | ⭐⭐⭐⭐ | ✅ | 免费/付费 | 全栈原型 |
| **Lovable** | React + Supabase | ⭐⭐⭐⭐ | ✅ | 付费 | 端到端应用 |
| **Screenshot to Code** | 多框架 | ⭐⭐⭐ | ❌ | 开源 | 截图还原 |
| **Builder.io** | 多框架 | ⭐⭐⭐⭐ | ❌ | 付费 | Figma 集成 |

### 如何选择

```
需要生成组件/页面？ → v0.dev
需要全栈原型？ → Bolt.new
需要端到端应用？ → Lovable
需要从截图还原？ → Screenshot to Code
需要 Figma 集成？ → Builder.io
```

---

## Section 4：实战演示（40 min）

### 实战 1：v0.dev 从 prompt 到生产级组件

**需求**：创建一个用户设置页面

```
Prompt: "创建一个用户设置页面，包含：
1. 个人信息表单（头像上传、姓名、邮箱、手机号）
2. 通知设置（邮件通知、推送通知、短信通知的开关）
3. 安全设置（修改密码、两步验证）
4. 危险区域（删除账号）
使用 shadcn/ui 的 Tabs 组件组织，支持暗色模式"
```

现场演示生成过程和代码质量。

### 实战 2：Bolt.new 快速搭建全栈原型

**需求**：创建一个简单的博客系统

```
Prompt: "创建一个博客系统：
- 文章列表页
- 文章详情页
- Markdown 编辑器
- 用户认证（登录/注册）
- SQLite 数据库
使用 Next.js + Prisma + shadcn/ui"
```

现场演示 Bolt.new 的在线 IDE 和实时预览。

### 实战 3：对比不同工具生成同一设计稿

拿同一张设计稿，分别用 v0.dev、Bolt.new、Screenshot to Code 生成代码，对比：
- 代码质量
- 还原度
- 生成速度
- 可维护性

---

## Closing（20 min）

### 今天的核心要点

1. **AI 代码生成工具改变了前端开发的角色**：从"写代码"到"审代码"
2. **v0.dev 是组件/页面生成的首选**：React + Tailwind + shadcn/ui 的最佳搭档
3. **不同工具有不同的适用场景**：选对工具很重要
4. **Prompt 质量决定生成质量**：学会写好 Prompt

### 行动建议

1. 注册 v0.dev，试试从 prompt 生成一个页面
2. 用 Bolt.new 搭建一个全栈原型
3. 把竞品截图丢给 Screenshot to Code，看看效果

### 下节课预告

下节课我们讲 **Monorepo 与代码组织**：
- 为什么 Monorepo 更 AI 友好
- Turborepo + pnpm workspace
- AGENTS.md 和 .cursorrules

### Q&A

现在我们有 20 分钟的 Q&A 时间。

---

**演讲稿完成！**

**总时长**: 约 2.5 小时
- Opening: 10 min
- Section 1: 15 min
- Section 2: 40 min
- Section 3: 35 min
- Section 4: 40 min
- Closing: 20 min
