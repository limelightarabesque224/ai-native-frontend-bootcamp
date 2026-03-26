# 认知重构：AI 友好性是新的选型维度
## 深度技术版演讲稿

---

## Opening Hook：现场实验（10 min）

好，大家好。今天我们不讲 PPT，先做个实验。

我这里有两个组件，功能完全一样——一个用户资料卡片。我现在让 AI 帮我修改这两个组件，给它们都加一个"编辑"按钮。

**第一个组件**，用的是 BEM + CSS Modules：

```jsx
// UserCard.jsx
import styles from './UserCard.module.css'

export function UserCard({ user }) {
  return (
    <div className={styles['user-card']}>
      <div className={styles['user-card__avatar']}>
        <img src={user.avatar} alt={user.name} />
      </div>
      <div className={styles['user-card__info']}>
        <h3 className={styles['user-card__name']}>{user.name}</h3>
        <p className={styles['user-card__email']}>{user.email}</p>
      </div>
    </div>
  )
}
```

```css
/* UserCard.module.css */
.user-card {
  display: flex;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.user-card__avatar {
  margin-right: 16px;
}

.user-card__info {
  flex: 1;
}
```

我告诉 AI："给这个卡片加一个编辑按钮，放在右上角"。

AI 的第一次输出：把按钮加在了 `user-card__info` 里面，位置不对。
第二次：CSS 类名写错了，写成了 `user-card-button` 而不是 `user-card__button`。
第三次：终于对了，但样式还需要调整。

**第二个组件**，用的是 Tailwind + shadcn/ui：

```jsx
import { Button } from '@/components/ui/button'

export function UserCard({ user }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>
  )
}
```

同样的需求："给这个卡片加一个编辑按钮，放在右上角"。

AI 的第一次输出：

```jsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg relative">
  <img
    src={user.avatar}
    alt={user.name}
    className="w-12 h-12 rounded-full"
  />
  <div className="flex-1">
    <h3 className="font-semibold">{user.name}</h3>
    <p className="text-sm text-gray-600">{user.email}</p>
  </div>
  <Button variant="ghost" size="sm" className="absolute top-2 right-2">
    编辑
  </Button>
</div>
```

一次就对了。位置对，样式对，代码质量也高。

**为什么？**

同样的 AI，同样的需求，为什么面对不同的技术栈，表现天差地别？

这就是我们今天要讨论的核心问题：**AI 友好性**。

---

## Section 1：技术选型的游戏规则变了（20 min）

### 传统的三大维度

我们做技术选型的时候，通常会考虑三个维度：

1. **DX（Developer Experience）**：开发体验好不好
2. **Performance**：性能够不够好
3. **Ecosystem**：生态够不够丰富

这三个维度，在过去 10 年里，基本上能覆盖我们 90% 的选型决策。

比如说：
- React 的 DX 好，生态丰富，所以我们选 React
- Vite 的性能好，所以我们从 Webpack 切到 Vite
- TypeScript 的生态成熟了，所以我们从 JavaScript 切到 TypeScript

但是，2023 年之后，游戏规则变了。

### 第四个维度：AI 友好性

为什么变了？因为 AI 工具成为了我们的"第二个开发者"。

你想想，如果你的团队里来了一个新人，你会怎么选技术栈？你会考虑：
- 这个技术栈新人容易上手吗？
- 这个技术栈的代码新人容易理解吗？
- 这个技术栈的文档新人容易查吗？

现在，AI 就是你的"新人"。而且是一个：
- 不会累的新人
- 不会抱怨的新人
- 但是会"看不懂代码"的新人

所以，我们需要第四个维度：**AI Friendliness（AI 友好性）**。

### 数据说话

我们团队做过一个实验，用两种技术栈开发同样的功能，对比 AI 辅助开发的效率：

| 技术栈 | AI 生成代码的准确率 | 需要人工修正的次数 | 总耗时 |
|--------|---------------------|-------------------|--------|
| BEM + CSS Modules + Ant Design | 45% | 平均 3.2 次 | 2.5 小时 |
| Tailwind + shadcn/ui + Radix | 85% | 平均 0.8 次 | 0.8 小时 |

**3 倍的效率差距。**

这不是 AI 工具的问题，是技术栈的问题。

---

## Section 2：LLM 如何理解你的代码（30 min）

### Token 化机制

好，现在我们深入一点。AI 到底是怎么"看"代码的？

LLM（大语言模型）处理代码的第一步，叫做 **Token 化**。

简单来说，就是把你的代码切成一个个"词"。但这个"词"不是我们人类理解的词，而是 AI 的"词"。

举个例子，这段 BEM 代码：

```css
.user-card__avatar--large {
  width: 64px;
}
```

在 AI 眼里，会被切成：

```
[".user", "-", "card", "__", "avatar", "--", "large", " {", "\n", "  width", ":", " ", "64", "px", ";", "\n", "}"]
```

17 个 Token。

而同样功能的 Tailwind 代码：

```html
<img className="w-16 h-16" />
```

被切成：

```
["<img", " className", '="', "w", "-", "16", " h", "-", "16", '"', " />"]
```

11 个 Token。

**为什么这很重要？**

因为 LLM 有一个硬限制：**上下文窗口**。

比如 Claude 3.5 Sonnet 的上下文窗口是 200K tokens。听起来很大对吧？

但你算算：
- 一个中等规模的 React 组件：500-1000 tokens
- 一个 CSS 文件：1000-2000 tokens
- 一个完整的页面（组件 + 样式 + 逻辑）：3000-5000 tokens

如果你的项目用的是 BEM + CSS Modules，AI 需要同时读取：
- 组件文件（JSX）
- 样式文件（CSS）
- 可能还有一个 types 文件（TS）

总共可能 5000+ tokens，才能理解一个组件。

而如果你用 Tailwind + shadcn/ui：
- 组件文件（JSX + 内联样式）
- 2000 tokens 就够了

**Token 越少，AI 能"看到"的上下文就越多，生成的代码就越准确。**

### 上下文窗口的影响

我给大家看一个真实的例子。

我们有一个项目，用的是传统技术栈。有一天我让 AI 帮我重构一个表单组件。

AI 的回复是：

> "抱歉，这个文件太大了，我只能看到前 80% 的内容。我建议你把这个组件拆分成更小的组件。"

但问题是，这个组件只有 300 行代码！

为什么 AI 说"太大"？因为它需要同时读取：
- 组件文件（300 行）
- 样式文件（200 行）
- 类型定义文件（100 行）
- 还有一些工具函数文件（150 行）

总共 750 行，大约 8000 tokens。加上我的 prompt 和 AI 的回复，已经接近上下文窗口的边界了。

后来我们把这个项目迁移到 Tailwind + shadcn/ui，同样的组件：
- 组件文件（250 行，包含内联样式）
- 类型定义（100 行）

总共 350 行，大约 3500 tokens。

AI 一次就能看完，生成的代码质量也高了很多。

### AI 眼中的好代码 vs 人眼中的好代码

这里有一个很有意思的现象：**AI 眼中的好代码，和人眼中的好代码，不完全一样。**

人类开发者喜欢：
- 语义化的类名（`.user-profile-card`）
- 关注点分离（HTML、CSS、JS 分开）
- 抽象和封装（把复杂逻辑藏起来）

AI 喜欢：
- 内联的语义（`className="flex items-center"`）
- 关注点聚合（样式和结构在一起）
- 透明和可见（能看到完整的实现）

举个例子，这是人类觉得"好"的代码：

```jsx
// UserCard.jsx
import styles from './UserCard.module.css'

export function UserCard({ user }) {
  return (
    <div className={styles.card}>
      <Avatar user={user} />
      <UserInfo user={user} />
    </div>
  )
}
```

干净、简洁、语义清晰。

但 AI 看到这段代码，它会想：
- `styles.card` 是什么样式？我需要去读 CSS 文件
- `Avatar` 组件长什么样？我需要去读 Avatar.jsx
- `UserInfo` 组件长什么样？我需要去读 UserInfo.jsx

AI 需要读 4 个文件，才能理解这个组件。

而这是 AI 觉得"好"的代码：

```jsx
import { Avatar } from '@/components/ui/avatar'

export function UserCard({ user }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Avatar src={user.avatar} alt={user.name} className="w-12 h-12" />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{user.name}</h3>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>
  )
}
```

AI 只需要读 1 个文件，就能理解整个组件的结构和样式。

**这不是说人类的审美错了，而是说我们需要在"人类可读"和"AI 可读"之间找到平衡。**

