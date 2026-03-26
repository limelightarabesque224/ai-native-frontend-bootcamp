# 演讲大纲：样式方案革命 - Tailwind CSS v4

## Opening Hook（10 min）
**现场演示**：让 AI 分别用 BEM、CSS Modules、Tailwind 实现同一个卡片组件
- 对比生成速度和代码质量
- 引出问题："为什么 Tailwind 让 AI 如此高效？"

## Section 1：传统 CSS 方案的 AI 盲区（20 min）
- BEM：语义分散，AI 难以理解类名与样式的关系
- CSS Modules：作用域隔离，AI 无法跨文件推理
- styled-components：运行时开销，AI 生成的代码性能差
- 数据对比：AI 处理不同 CSS 方案的效率

## Section 2：Utility-first 的底层逻辑（25 min）
- 什么是 utility-first
- 为什么语义内联对 AI 友好
- Token 效率对比
- 响应式设计的 AI 友好写法

## Section 3：Tailwind v4 核心变化（30 min）
- **CSS-first 配置**：@theme、@plugin 指令
- **Oxide 引擎**：10x 性能提升、更小的 bundle
- **新特性**：新颜色系统（v4.2+）、改进的容器查询
- 与 v3 的对比

## Section 4：实战迁移策略（30 min）
- 评估现有项目
- 渐进式迁移步骤
- 常见问题和解决方案
- 团队协作和规范

## Section 5：AI 辅助开发实战（20 min）
- 用 Cursor 生成 Tailwind 组件
- Prompt 技巧
- 常见错误和优化

## Closing（15 min）
- 总结核心要点
- 预告下节课（shadcn/ui）
- Q&A
