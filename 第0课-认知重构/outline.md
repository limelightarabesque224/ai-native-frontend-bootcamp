# 演讲大纲：认知重构 - AI 友好性是新的选型维度

## Opening Hook（10 min）
**场景再现**：让 AI 分别修改一个 BEM + CSS Modules 组件和一个 Tailwind + shadcn/ui 组件，现场对比结果。
- 传统技术栈：AI 反复出错，需要多次修正
- AI-Native 技术栈：一次生成，质量达标
- 抛出问题："为什么同样的 AI，面对不同技术栈表现天差地别？"

## Section 1：技术选型的游戏规则变了（20 min）
- 传统三大维度：DX、性能、生态
- ��什么这三个维度不够了
- 引入第四维度：AI 友好性
- 数据支撑：AI 友好技术栈 vs 传统技术栈的效率对比

## Section 2：LLM 如何理解你的代码（30 min）
- Token 化机制：代码如何被切分
- 上下文窗口：为什么文件太大 AI 就"傻了"
- 代码可读性 ≠ 人的可读性：AI 眼中的好代码长什么样
- 代码示例对比：
  - BEM 类名 vs Tailwind utility classes
  - 封装的 Ant Design 组件 vs 透明的 shadcn/ui 组件
  - 按技术分层的目录 vs 按功能切片的目录

## Section 3：AI 友好代码的四大特征（25 min）
- **语义内联（Semantic Inline）**
  - Tailwind：样式在 HTML 中，AI 无需跨文件
  - 对比：CSS 文件 vs Tailwind classes
- **源码可见（Source Visible）**
  - shadcn/ui：代码在项目中，AI 可以直接修改
  - 对比：node_modules 黑盒 vs 本地源码
- **约定优于配置（Convention over Configuration）**
  - Monorepo 的文件结构约定
  - AGENTS.md / .cursorrules 的作用
- **组合优于继承（Composition over Inheritance）**
  - Radix UI 的 Composition 模式
  - AI 更擅长组合原语，而不是理解继承链

## Section 4：AI-Native 技术栈全景图（20 min）
- 样式层：Tailwind CSS v4（后续详讲）
- 组件层：shadcn/ui + Radix UI（后续详讲）
- 设计工具：Figma AI、v0.dev、Bolt.new（后续详讲）
- 架构层：Turborepo + pnpm（后续详讲）
- 测试层：Playwright MCP（后续详讲）
- 开发工具：Cursor、Windsurf（后续详讲）
- AI 集成：Vercel AI SDK（后续详讲）
- 每个技术点用一句话说清楚为什么它 AI 友好

## Closing（15 min）
- 总结：AI 友好性评估的核心原则
- 预告：下一节课深入 Tailwind CSS v4
- Q&A

## 需要的代码示例
1. BEM CSS vs Tailwind CSS（同一个卡片组件）
2. Ant Design Dialog vs shadcn/ui Dialog（同一个弹窗）
3. 按技术分层的目录结构 vs 按功能切片的 Monorepo
4. AI 处理两种代码的效果对比截图
