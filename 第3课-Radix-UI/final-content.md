# 第 3 课：无头组件的底层逻辑 — Radix UI 深度剖析

> 讲师演讲稿 | 时长：2.5 小时
> 受众：3-5 年中高级前端工程师
> 风格：故事开场 + 技术深度 + 实践建议

---

## Opening Hook（10 min）

各位好，欢迎来到第三课。

在正式开始之前，我想先问大家一个问题——一个我自己曾经非常困惑的问题。

2023 年，有一个项目横空出世，叫 shadcn/ui。它在 GitHub 上的增长速度极其惊人，短短几个月就拿到了几万颗星。到今天，它已经是 React 生态中最受欢迎的 UI 方案之一。

但如果你仔细看过 shadcn/ui 的源码，你会发现一件有意思的事情：它自己几乎没有实现任何组件逻辑。

你打开一个 Dialog 组件的代码，核心就这么几行：

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogContent = DialogPrimitive.Content

export { Dialog, DialogTrigger, DialogContent }
```

就这样。没有状态管理，没有事件处理，没有可访问性逻辑。所有的核心能力，全部来自 `@radix-ui/react-dialog`。

这就引出了今天的核心问题：**为什么 shadcn/ui 选择 Radix，而不是自己实现？**

是因为 shadcn 的作者偷懒吗？显然不是。

是因为 Radix 做了什么特别的事情吗？是的。

今天这节课，我们就要深入 Radix UI 的底层，搞清楚三件事：

1. 什么是 Headless UI，为什么它对 AI 时代特别重要
2. Radix 的 Composition 模式是如何设计的
3. shadcn/ui 如何基于 Radix 构建出完整的组件库

好，我们开始。

---

## Section 1：什么是 Headless UI（20 min）

### 1.1 传统组件库的问题

在讲 Headless UI 之前，我们先回顾一下传统组件库是怎么做的。

假设你要用 Ant Design 的 Modal 组件：

```tsx
import { Modal } from 'antd'

<Modal
  title="确认删除"
  open={isOpen}
  onOk={handleOk}
  onCancel={handleCancel}
>
  <p>确定要删除这条记录吗？</p>
</Modal>
```

看起来很简单对吧？但问题来了：

**问题 1：样式耦合**
你想改 Modal 的样式？对不起，你得覆盖 Ant Design 的 CSS 类名。你想改动画？对不起，你得深入研究它的 transition 实现。

**问题 2：行为固定**
你想让 Modal 点击外部不关闭？你得找到对应的 prop。你想自定义关闭逻辑？你得研究它的生命周期。

**问题 3：可访问性黑盒**
Ant Design 确实做了可访问性，但你不知道它做了什么。你想调整焦点管理？你想改键盘导航？基本上很难。

这就是传统组件库的核心矛盾：**它给了你便利，但也限制了你的自由。**

### 1.2 Headless UI 的核心思想

Headless UI 的思路完全不同。它说：

> 我只给你逻辑和行为，样式你自己决定。

什么意思？我们看一个 Radix Dialog 的例子：

```tsx
import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Trigger asChild>
    <button>打开对话框</button>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 ...">
      <Dialog.Title>确认删除</Dialog.Title>
      <Dialog.Description>
        确定要删除这条记录吗？
      </Dialog.Description>

      <button onClick={() => setIsOpen(false)}>取消</button>
      <button onClick={handleDelete}>确认</button>

      <Dialog.Close asChild>
        <button>×</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

注意看，Radix 做了什么：

1. **状态管理**：`open` 和 `onOpenChange` 帮你管理开关状态
2. **Portal 渲染**：`Dialog.Portal` 自动把内容渲染到 body 下
3. **焦点管理**：打开时自动聚焦，关闭时恢复焦点
4. **键盘导航**：按 ESC 自动关闭
5. **ARIA 属性**：自动添加 `role="dialog"`、`aria-labelledby` 等

但 Radix 没有做什么：

1. **没有样式**：`className` 完全由你控制
2. **没有动画**：你可以用 Framer Motion、CSS transition，随便你
3. **没有主题**：没有 primary、secondary 这些概念

这就是 Headless UI 的核心：**分离逻辑与样式。**

### 1.3 为什么对 AI 更友好？

这里我要讲一个很多人没意识到的点：Headless UI 对 AI 特别友好。

为什么？因为 AI 擅长的是**组合和定制**，而不是**理解复杂的样式系统**。

举个例子，你让 AI 帮你写一个 Ant Design 的 Modal：
AI 会给你生成一堆 `className` 覆盖，但很可能不生效，因为 Ant Design 的样式优先级很复杂。

但如果你让 AI 帮你写一个 Radix + Tailwind 的 Dialog：

AI 只需要组合 Radix 的原语，然后加上 Tailwind 类名。这对 AI 来说非常简单，因为：

1. **结构清晰**：`Dialog.Root`、`Dialog.Trigger`、`Dialog.Content` 语义明确
2. **样式独立**：Tailwind 类名是原子化的，AI 很容易理解
3. **可组合**：AI 可以自由组合不同的部分

这就是为什么 shadcn/ui 这种基于 Headless UI 的方案，在 AI 时代特别有优势。

好，第一部分讲完了。我们总结一下：

**Headless UI = 逻辑 + 行为 + 可访问性，但不包含样式。**

它对 AI 友好，因为它把复杂的逻辑封装起来，但把灵活的样式留给开发者（或 AI）。

---

## Section 2：Radix UI 的 Composition 模式（30 min）

### 2.1 为什么不是单一组件？

现在我们深入 Radix 的设计。

你可能会问：为什么 Radix 要把一个 Dialog 拆成这么多部分？

```tsx
Dialog.Root
Dialog.Trigger
Dialog.Portal
Dialog.Overlay
Dialog.Content
Dialog.Title
Dialog.Description
Dialog.Close
```

为什么不直接一个 `<Dialog>` 组件搞定？

答案是：**灵活性。**

我们看一个实际场景。假设你要做一个确认删除的对话框，但你希望：

1. 触发按钮是一个红色的危险按钮
2. 遮罩层要有模糊效果
3. 内容区域要有圆角和阴影
4. 标题要加一个警告图标
5. 关闭按钮要放在右上角

如果是单一组件，你得这样写：

```tsx
<Dialog
  trigger={<Button danger>删除</Button>}
  overlayClassName="backdrop-blur-sm"
  contentClassName="rounded-lg shadow-xl"
  titleIcon={<WarningIcon />}
  closeButtonPosition="top-right"
>
  ...
</Dialog>
```

这样的问题是：

1. **Props 爆炸**：每个定制需求都要加一个 prop
2. **灵活性受限**：如果你想在标题和描述之间加一个图片呢？没有对应的 prop
3. **维护困难**：组件库要维护所有可能的定制需求

Radix 的 Composition 模式完全不同。它说：

> 我给你一堆原语（primitives），你自己组合。

### 2.2 Composition 模式的核心

我们看一个完整的例子：

```tsx
import * as Dialog from '@radix-ui/react-dialog'
import { X, AlertTriangle } from 'lucide-react'

function DeleteConfirmDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* 触发器：可以是任何元素 */}
      <Dialog.Trigger asChild>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          删除
        </button>
      </Dialog.Trigger>

      {/* Portal：渲染到 body */}
      <Dialog.Portal>
        {/* 遮罩层：完全自定义 */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* 内容区域：完全自定义 */}
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-[400px]">
          {/* 标题：可以加任何内容 */}
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" />
            <Dialog.Title className="text-lg font-semibold">
              确认删除
            </Dialog.Title>
          </div>

          {/* 描述 */}
          <Dialog.Description className="text-gray-600 mb-6">
            此操作不可撤销。确定要删除这条记录吗？
          </Dialog.Description>

          {/* 自定义内容：可以加任何东西 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
            <p className="text-sm text-yellow-800">
              警告：删除后将无法恢复
            </p>
          </div>

          {/* 按钮组 */}
          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 border rounded">
                取消
              </button>
            </Dialog.Close>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => {
                // 执行删除
                setOpen(false)
              }}
            >
              确认删除
            </button>
          </div>

          {/* 关闭按钮：放在右上角 */}
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

看到了吗？每个部分都是独立的，你可以：

1. **自由组合**：在标题和描述之间加警告框
2. **完全定制**：每个部分的样式完全由你控制
3. **灵活布局**：关闭按钮可以放在任何位置

这就是 Composition 模式的威力。

### 2.3 asChild 的魔法

这里有一个很重要的细节：`asChild` prop。

你注意到了吗？很多地方都用了 `asChild`：

```tsx
<Dialog.Trigger asChild>
  <button>删除</button>
</Dialog.Trigger>

<Dialog.Close asChild>
  <button>×</button>
</Dialog.Close>
```

为什么要这样写？为什么不直接：

```tsx
<Dialog.Trigger>删除</Dialog.Trigger>
```

答案是：**避免额外的 DOM 节点。**

如果没有 `asChild`，Radix 会渲染成这样：

```html
<button data-radix-trigger>
  <button>删除</button>
</button>
```

两层 button，这在语义上是错误的。

但有了 `asChild`，Radix 会把属性和事件合并到子元素上：

```html
<button data-radix-trigger>删除</button>
```

只有一层 button，完美。

这个技术叫做 **Slot Pattern**，Radix 用的是 `@radix-ui/react-slot` 这个包实现的。

核心代码很简单：

```tsx
// 简化版的 Slot 实现
function Slot({ children, ...props }) {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...children.props,
    })
  }
  return null
}
```

就是用 `cloneElement` 把 props 合并到子元素上。

### 2.4 AI 如何理解这种结构？

现在回到 AI 的话题。

Composition 模式对 AI 特别友好，因为：

1. **语义清晰**：`Dialog.Title` 一看就知道是标题
2. **结构明确**：Root → Trigger → Portal → Content，层级关系一目了然
3. **可预测**：每个部分的职责单一，AI 很容易推理

举个例子，你让 AI 帮你写一个 Dialog，AI 会这样思考：

```
1. 需要一个 Dialog.Root 来管理状态
2. 需要一个 Dialog.Trigger 来触发
3. 需要一个 Dialog.Portal 来渲染到 body
4. 需要一个 Dialog.Overlay 作为遮罩
5. 需要一个 Dialog.Content 作为内容容器
6. 需要 Dialog.Title 和 Dialog.Description 提供语义
7. 需要 Dialog.Close 来关闭
```

这个思考过程非常线性，AI 很容易生成正确的代码。

相比之下，如果是单一组件，AI 需要记住所有的 props，还要理解它们之间的关系，容易出错。

---

## Section 3：可访问性原语（25 min）

### 3.1 为什么可访问性这么重要？

好，现在我们讲 Radix 最核心的价值：可访问性。

很多人觉得可访问性是一个"nice to have"的特性，但实际上：

1. **法律要求**：很多国家有无障碍法规（如美国的 ADA、欧盟的 EAA）
2. **用户体验**：不只是残障人士，键盘用户、老年人都受益
3. **SEO**：搜索引擎会考虑可访问性
4. **技术债务**：后期补可访问性成本极高

但可访问性很难做对。我们看一个例子。

### 3.2 手写 Dialog 的可访问性陷阱

假设你要手写一个 Dialog，你可能会这样写：

```tsx
function MyDialog({ open, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50" onClick={onClose}>
      <div className="fixed top-1/2 left-1/2 ...">
        {children}
      </div>
    </div>
  )
}
```

看起来没问题对吧？但实际上有一堆可访问性问题：

**问题 1：没有 ARIA 属性**
- 缺少 `role="dialog"`
- 缺少 `aria-modal="true"`
- 缺少 `aria-labelledby` 和 `aria-describedby`

**问题 2：焦点管理混乱**
- 打开时焦点没有移到 Dialog 内
- 关闭时焦点没有恢复到触发元素
- 焦点可以跑到 Dialog 外面

**问题 3：键盘导航不完整**
- 按 ESC 不能关闭
- Tab 键可以跳出 Dialog
- 没有焦点陷阱（focus trap）

**问题 4：屏幕阅读器支持差**
- 打开时没有通知用户
- 背景内容没有被隐藏（aria-hidden）

这些问题，每一个都需要大量代码来解决。

### 3.3 Radix 如何自动处理可访问性？

现在我们看 Radix 是怎么做的。

同样的 Dialog，用 Radix 写：

```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>打开</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>标题</Dialog.Title>
      <Dialog.Description>描述</Dialog.Description>
      <Dialog.Close>关闭</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Radix 会自动：

**1. 注入 ARIA 属性**

渲染出来的 HTML：

```html
<div 
  role="dialog" 
  aria-modal="true"
  aria-labelledby="radix-:r1:"
  aria-describedby="radix-:r2:"
>
  <h2 id="radix-:r1:">标题</h2>
  <p id="radix-:r2:">描述</p>
</div>
```

注意：
- `role="dialog"` 告诉屏幕阅读器这是一个对话框
- `aria-modal="true"` 表示这是模态的
- `aria-labelledby` 和 `aria-describedby` 自动关联标题和描述

**2. 焦点管理**

```tsx
// Radix 内部的焦点管理逻辑（简化版）
useEffect(() => {
  if (open) {
    // 保存当前焦点
    const previousFocus = document.activeElement
    
    // 移动焦点到 Dialog
    contentRef.current?.focus()
    
    return () => {
      // 恢复焦点
      previousFocus?.focus()
    }
  }
}, [open])
```

**3. 焦点陷阱（Focus Trap）**

Radix 会确保 Tab 键只在 Dialog 内循环：

```tsx
// 简化版的焦点陷阱逻辑
function handleKeyDown(e) {
  if (e.key === 'Tab') {
    const focusableElements = contentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}
```

**4. 键盘导航**

```tsx
// ESC 关闭
function handleKeyDown(e) {
  if (e.key === 'Escape') {
    onOpenChange(false)
  }
}
```

**5. 背景内容隐藏**

```tsx
// 打开时隐藏背景内容
useEffect(() => {
  if (open) {
    document.body.setAttribute('aria-hidden', 'true')
    return () => {
      document.body.removeAttribute('aria-hidden')
    }
  }
}, [open])
```

所有这些，你一行代码都不用写，Radix 全部帮你搞定。

### 3.4 实际测试

我们来实际测试一下。打开一个用 Radix 做的 Dialog，然后：

**键盘测试：**
- 按 Tab：焦点在 Dialog 内循环 ✓
- 按 ESC：Dialog 关闭 ✓
- 关闭后：焦点回到触发按钮 ✓

**屏幕阅读器测试：**
- 打开 VoiceOver（Mac）或 NVDA（Windows）
- 打开 Dialog：会读出"对话框，标题，描述" ✓
- Tab 导航：会读出每个元素的作用 ✓

这就是 Radix 的价值：**你不需要成为可访问性专家，就能做出符合标准的组件。**


---

## Section 4：shadcn/ui 如何基于 Radix 构建（20 min）

### 4.1 shadcn/ui 的核心思路

好，现在我们终于可以讲 shadcn/ui 了。

shadcn/ui 的核心思路非常简单：

**shadcn/ui = Radix 原语 + Tailwind 样式 + 复制粘贴**

什么意思？

传统的组件库，你是这样用的：

```bash
npm install antd
```

```tsx
import { Button } from 'antd'
```

但 shadcn/ui 不是这样。它没有 npm 包，你不能 `npm install shadcn/ui`。

你是这样用的：

```bash
npx shadcn-ui@latest add button
```

这个命令会做什么？它会把 Button 组件的源码直接复制到你的项目里：

```
src/
  components/
    ui/
      button.tsx  ← 源码直接在你的项目里
```

为什么要这样做？

**优势 1：完全可定制**
代码在你的项目里，你想怎么改就怎么改。不喜欢默认样式？直接改。想加新功能？直接加。

**优势 2：没有版本依赖**
不会出现"升级组件库导致整个项目崩溃"的情况。每个组件都是独立的。

**优势 3：按需使用**
只复制你需要的组件，不会有多余的代码。

**优势 4：学习成本低**
代码就在你面前，你可以直接看实现，学习如何用 Radix + Tailwind 构建组件。

### 4.2 代码走读：Button

我们看一个最简单的例子：Button。

shadcn/ui 的 Button 源码：

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // 基础样式
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

我们拆解一下：

**1. 使用 Radix 的 Slot**

```tsx
import { Slot } from "@radix-ui/react-slot"
```

这样 Button 可以支持 `asChild`，避免额外的 DOM 节点。

**2. 使用 CVA 管理变体**

```tsx
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "基础样式",
  {
    variants: {
      variant: { ... },
      size: { ... },
    }
  }
)
```

CVA（Class Variance Authority）是一个用来管理 Tailwind 变体的工具。它让你可以定义不同的变体组合。

**3. 使用 cn 合并类名**

```tsx
import { cn } from "@/lib/utils"

className={cn(buttonVariants({ variant, size, className }))}
```

`cn` 是一个工具函数，用来合并 Tailwind 类名，避免冲突。

实现很简单：

```tsx
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

- `clsx`：合并类名
- `twMerge`：解决 Tailwind 类名冲突（比如 `px-4 px-2` 会保留后者）

### 4.3 代码走读：Dialog

现在我们看一个复杂的例子：Dialog。

shadcn/ui 的 Dialog 源码：

```tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

看到了吗？核心逻辑：

1. **直接导出 Radix 原语**：`Dialog`、`DialogTrigger` 等直接等于 Radix 的组件
2. **包装样式**：`DialogOverlay`、`DialogContent` 等用 `forwardRef` 包装，加上 Tailwind 样式
3. **添加便利组件**：`DialogHeader`、`DialogFooter` 是 shadcn/ui 自己加的，方便布局
4. **内置关闭按钮**：`DialogContent` 里自动包含一个关闭按钮

使用起来：

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>打开对话框</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>确认删除</DialogTitle>
      <DialogDescription>
        此操作不可撤销。确定要删除这条记录吗？
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">取消</Button>
      <Button variant="destructive">删除</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

简洁、清晰、可定制。

### 4.4 代码走读：Select

最后我们看一个更复杂的例子：Select。

Select 的特殊之处在于，它需要处理很多交互细节：

- 键盘导航（上下箭头）
- 搜索（输入字母快速定位）
- 滚动（选项很多时）
- 可访问性（屏幕阅读器）

Radix 的 Select 原语：

```tsx
<Select.Root>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Viewport>
        <Select.Item value="apple">
          <Select.ItemText>Apple</Select.ItemText>
          <Select.ItemIndicator>✓</Select.ItemIndicator>
        </Select.Item>
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

shadcn/ui 的包装（简化版）：

```tsx
const Select = SelectPrimitive.Root
const SelectTrigger = React.forwardRef<...>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

const SelectContent = React.forwardRef<...>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))

const SelectItem = React.forwardRef<...>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
```

使用起来：

```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="选择水果" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">苹果</SelectItem>
    <SelectItem value="banana">香蕉</SelectItem>
    <SelectItem value="orange">橙子</SelectItem>
  </SelectContent>
</Select>
```

所有的复杂逻辑（键盘导航、搜索、可访问性）都由 Radix 处理，shadcn/ui 只负责样式。

---

## Section 5：横向对比（20 min）

### 5.1 Headless UI 生态

好，现在我们把视野放宽一点。Radix 不是唯一的 Headless UI 库。

市面上主要有这几个：

1. **Radix UI**（React）
2. **Headless UI**（React / Vue）
3. **React Aria**（React）
4. **Ark UI**（React / Vue / Solid）
5. **Kobalte**（Solid）

我们来横向对比一下。

### 5.2 对比表格

| 特性 | Radix UI | Headless UI | React Aria | Ark UI | Kobalte |
|------|----------|-------------|------------|--------|---------|
| **框架支持** | React | React, Vue | React | React, Vue, Solid | Solid |
| **组件数量** | 30+ | 10+ | 40+ | 25+ | 20+ |
| **Composition 模式** | ✅ 强 | ⚠️ 中 | ✅ 强 | ✅ 强 | ✅ 强 |
| **可访问性** | ✅ WCAG 2.1 AA | ✅ WCAG 2.1 AA | ✅ WCAG 2.1 AAA | ✅ WCAG 2.1 AA | ✅ WCAG 2.1 AA |
| **样式方案** | 无 | 无 | 无 | 无 | 无 |
| **动画支持** | 需自行实现 | 内置 transition | 需自行实现 | 需自行实现 | 需自行实现 |
| **TypeScript** | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ 完整 |
| **文档质量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **社区生态** | 🔥 最活跃 | 🔥 活跃 | 🔥 活跃 | 🌱 成长中 | 🌱 成长中 |
| **维护者** | Modulz | Tailwind Labs | Adobe | Chakra UI 团队 | Kobalte 团队 |
| **GitHub Stars** | 15k+ | 25k+ | 12k+ | 3k+ | 1k+ |
| **Bundle Size** | ~50kb | ~30kb | ~80kb | ~60kb | ~40kb |

### 5.3 详细对比

**Radix UI**

优势：
- Composition 模式最成熟
- 组件最丰富
- shadcn/ui 生态加持
- 文档和示例非常详细

劣势：
- 只支持 React
- 没有内置动画（需要配合 Framer Motion 等）
- Bundle size 相对较大

适合场景：
- React 项目
- 需要高度定制的 UI
- 配合 shadcn/ui 使用

**Headless UI**

优势：
- 支持 React 和 Vue
- 内置 transition 动画
- Bundle size 小
- Tailwind Labs 官方维护

劣势：
- 组件数量少（只有 10 个左右）
- Composition 模式不如 Radix 灵活
- 文档相对简单

适合场景：
- 使用 Tailwind CSS 的项目
- 需要简单的 Headless 组件
- Vue 项目

**React Aria**

优势：
- Adobe 出品，可访问性最强（WCAG 2.1 AAA）
- 组件最多（40+）
- 文档非常详细
- 提供 React Aria Components（预设样式版本）

劣势：
- 学习曲线陡峭
- API 相对复杂
- Bundle size 最大

适合场景：
- 对可访问性要求极高的项目
- 企业级应用
- 需要复杂交互的组件

**Ark UI**

优势：
- 支持 React、Vue、Solid 三个框架
- Chakra UI 团队出品，设计理念成熟
- Composition 模式灵活

劣势：
- 相对较新，生态还在成长
- 文档还在完善中
- 社区相对较小

适合场景：
- 多框架项目
- 喜欢 Chakra UI 设计理念的团队

**Kobalte**

优势：
- Solid 生态最好的 Headless UI 库
- API 设计优雅
- 性能优秀（Solid 的优势）

劣势：
- 只支持 Solid
- 社区较小
- 组件数量相对较少

适合场景：
- Solid 项目
- 追求极致性能

### 5.4 如何选择？

我的建议：

**如果你用 React + Tailwind**
→ Radix UI + shadcn/ui（首选）
→ Headless UI（备选）

**如果你用 Vue + Tailwind**
→ Headless UI（首选）
→ Ark UI（备选）

**如果你对可访问性要求极高**
→ React Aria

**如果你用 Solid**
→ Kobalte

**如果你需要多框架支持**
→ Ark UI

### 5.5 实际案例

我们看几个实际案例：

**案例 1：Vercel**
- 使用 Radix UI
- 配合自己的设计系统
- 高度定制化

**案例 2：Linear**
- 使用 Radix UI
- 极致的交互体验
- 自定义动画

**案例 3：GitHub**
- 使用 React Aria（部分组件）
- 可访问性要求高
- 企业级应用

**案例 4：Tailwind UI**
- 使用 Headless UI
- 官方示例
- 简单直接


---

## Closing（15 min）

### 6.1 总结

好，我们今天讲了很多内容。我们来快速回顾一下。

**核心要点 1：Headless UI 的本质**

Headless UI 不是一个新技术，而是一个设计理念：

> 分离逻辑与样式，让组件库专注于行为和可访问性，把样式的自由留给开发者。

这个理念在 AI 时代特别重要，因为 AI 擅长组合和定制，而不是理解复杂的样式系统。

**核心要点 2：Radix 的 Composition 模式**

Radix 不是给你一个大而全的组件，而是给你一堆小而精的原语（primitives）：

```
Dialog.Root
Dialog.Trigger
Dialog.Portal
Dialog.Overlay
Dialog.Content
Dialog.Title
Dialog.Description
Dialog.Close
```

你可以自由组合这些原语，构建出任何你想要的 UI。

**核心要点 3：可访问性不是可选项**

Radix 自动处理：
- ARIA 属性
- 焦点管理
- 键盘导航
- 屏幕阅读器支持

你不需要成为可访问性专家，就能做出符合标准的组件。

**核心要点 4：shadcn/ui 的创新**

shadcn/ui = Radix 原语 + Tailwind 样式 + 复制粘贴

它不是一个 npm 包，而是一个代码生成器。它把组件源码直接复制到你的项目里，给你完全的控制权。

### 6.2 实践建议

基于今天的内容，我给大家几个实践建议：

**建议 1：从 shadcn/ui 开始**

如果你是第一次接触 Headless UI，不要直接用 Radix。先用 shadcn/ui：

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button dialog select
```

看看 shadcn/ui 是怎么封装 Radix 的，学习它的设计模式。

**建议 2：理解 Composition 模式**

花时间理解 Radix 的 Composition 模式。不要把它当成"麻烦"，而要把它当成"灵活性"。

试着自己组合一个复杂的 Dialog，加上自定义的动画、布局、交互。你会发现 Composition 模式的威力。

**建议 3：学习可访问性基础**

虽然 Radix 帮你处理了大部分可访问性问题，但你还是应该了解基础知识：

- 什么是 ARIA 属性？
- 什么是焦点管理？
- 什么是键盘导航？
- 什么是屏幕阅读器？

推荐资源：
- MDN 的可访问性指南
- W3C 的 ARIA 规范
- WebAIM 的教程

**建议 4：建立自己的组件库**

不要每个项目都重新写一遍组件。基于 shadcn/ui，建立你们团队自己的组件库：

```
my-ui/
  components/
    button.tsx
    dialog.tsx
    select.tsx
    ...
  lib/
    utils.ts
  styles/
    globals.css
```

把常用的组件、工具函数、样式都放进去，形成团队的设计系统。

**建议 5：拥抱 AI**

Headless UI 对 AI 特别友好。试着让 AI 帮你写组件：

```
"用 Radix Dialog 和 Tailwind 写一个确认删除对话框，
要有警告图标、红色按钮、模糊背景"
```

你会发现 AI 生成的代码质量很高，因为 Radix 的结构清晰、可预测。

### 6.3 常见问题

在结束之前，我回答几个常见问题：

**Q1：Radix 的 Bundle Size 会不会太大？**

A：Radix 是按需导入的。你只用 Dialog，就只会打包 Dialog 的代码。一个 Dialog 组件大约 10-15kb（gzipped）。

而且，Radix 的代码质量很高，tree-shaking 效果很好。

**Q2：Radix 的性能怎么样？**

A：Radix 的性能非常好。它没有复杂的样式计算，没有运行时的 CSS-in-JS，只有纯粹的 React 组件。

而且，Radix 大量使用了 React 的优化技术（memo、useMemo、useCallback 等）。

**Q3：Radix 适合移动端吗？**

A：Radix 主要是为桌面端设计的，但也支持移动端。

不过，移动端有一些特殊的交互模式（比如底部抽屉、滑动手势），Radix 没有直接支持。你需要自己实现，或者用其他库（比如 Vaul）。

**Q4：Radix 和 Chakra UI / Ant Design 能一起用吗？**

A：可以，但不推荐。

Radix 和传统组件库的设计理念不同，混用会导致样式冲突、可访问性问题。

如果你要迁移，建议逐步替换，不要混用。

**Q5：shadcn/ui 的代码可以直接用在生产环境吗？**

A：可以。shadcn/ui 的代码质量很高，经过了大量项目的验证。

但记住，代码在你的项目里，你要负责维护。如果 shadcn/ui 更新了，你需要手动同步。

### 6.4 下节课预告

好，今天的课就到这里。

下节课，我们要讲一个更激动人心的话题：**Design to Code — AI 如何从设计稿生成代码**。

我们会讲：

1. **Figma 的设计系统**：如何在 Figma 中建立可被 AI 理解的设计系统
2. **v0.dev 的原理**：Vercel 的 AI 设计工具是如何工作的
3. **从设计到代码的完整流程**：设计师 → Figma → AI → shadcn/ui 代码
4. **实战演示**：现场用 AI 从设计稿生成一个完整的页面

为什么今天要先讲 Radix 和 shadcn/ui？因为它们是 Design to Code 的基础。

AI 生成的代码，大部分都是基于 Radix + Tailwind 的。如果你不理解 Radix 的 Composition 模式，你就无法理解 AI 生成的代码。

所以，今天的内容是下节课的铺垫。

### 6.5 作业

最后，给大家留一个作业：

**用 Radix + Tailwind 实现一个复杂的 Popover 组件**

要求：
1. 支持四个方向（top、right、bottom、left）
2. 支持箭头指示器
3. 支持点击外部关闭
4. 支持 ESC 关闭
5. 支持键盘导航
6. 完全可访问

提示：
- 使用 `@radix-ui/react-popover`
- 使用 Tailwind 的 `data-[side]` 选择器处理不同方向
- 使用 `@radix-ui/react-arrow` 实现箭头

参考 shadcn/ui 的 Popover 实现，但不要直接复制，试着自己理解每一行代码。

下节课我会讲解这个作业，并展示几个优秀的实现。

### 6.6 Q&A

好，现在是 Q&A 时间。大家有什么问题吗？

（预留 10 分钟 Q&A 时间）

---

**常见 Q&A 参考：**

**Q：Radix 的学习曲线会不会太陡？**

A：确实比传统组件库陡一些，但一旦理解了 Composition 模式，你会发现它其实更简单。因为每个部分的职责都很清晰，没有隐藏的魔法。

我的建议是：先用 shadcn/ui，看它是怎么封装的。然后再尝试自己用 Radix 实现一些简单的组件。

**Q：为什么不用 Material-UI 或 Ant Design？**

A：Material-UI 和 Ant Design 都是很好的组件库，但它们的设计理念不同。

如果你需要快速搭建一个标准的后台系统，Ant Design 是很好的选择。

但如果你需要高度定制的 UI，或者你在做一个面向 C 端的产品，Radix + shadcn/ui 会给你更多的自由。

而且，在 AI 时代，Headless UI 的优势会越来越明显。

**Q：Radix 的可访问性真的有那么重要吗？**

A：非常重要。

首先，很多国家有法律要求（如美国的 ADA）。如果你的网站不符合可访问性标准，可能会被起诉。

其次，可访问性不只是为了残障人士。键盘用户、老年人、使用屏幕阅读器的用户，都会受益。

最后，可访问性也是 SEO 的一部分。搜索引擎会考虑网站的可访问性。

**Q：shadcn/ui 的代码会不会过时？**

A：这是一个合理的担忧。shadcn/ui 的代码在你的项目里，如果 Radix 或 Tailwind 有重大更新，你需要手动同步。

但实际上，Radix 和 Tailwind 都很稳定，不会频繁有 breaking changes。

而且，代码在你的项目里，你可以根据自己的需求修改，不会被组件库的更新"绑架"。

**Q：有没有 Vue 版本的 shadcn/ui？**

A：有！shadcn-vue 项目提供了 Vue 版本，基于 Radix Vue（Radix 的 Vue 移植版）。

不过，Vue 生态中 Headless UI（Tailwind Labs 出品）也是一个很好的选择。

---

好，今天的课就到这里。感谢大家的参与！

记住：**Headless UI 不是让你的工作变复杂，而是给你更多的自由。**

下节课见！

---

**课程结束**

*总时长：约 2.5 小时*
*包含：理论讲解 + 代码示例 + 实战演示 + Q&A*

