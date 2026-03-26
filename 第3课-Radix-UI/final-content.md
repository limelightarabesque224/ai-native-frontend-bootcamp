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