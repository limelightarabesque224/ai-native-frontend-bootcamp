# Skills 与 MCP 课程正文强化 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `第10课` 的 `MCP tools` 章节升级为“常用 Skills + MCP tools”，并补强 `第8课` 的 Skills 内容，使其更聚焦前端开发中的高频 Skills 与工作流。

**Architecture:** 先修改 `第10课`，建立 “Skill 决定怎么做、MCP 决定能连什么” 的主叙事；再补强 `第8课`，把原本偏分类说明的 Skills 内容升级成“高频场景 + 工作流链路”的讲法。整体以最小必要改动完成，不扩展到其他课程主体结构。

**Tech Stack:** Markdown、Mermaid、现有课程讲稿结构

---

## Chunk 1: 第10课正文重构

### Task 1: 重写第10课 Section 5 结构

**Files:**
- Modify: `第10课-工程化与全栈化/final-content.md`
- Reference: `docs/superpowers/specs/2026-03-31-skills-mcp-course-design.md`

- [ ] **Step 1: 读取当前 Section 5 的完整内容与上下文**

Run: 读取 `第10课-工程化与全栈化/final-content.md` 中 `Section 5` 附近内容  
Expected: 明确当前标题、导语、表格、衔接段、总结位置

- [ ] **Step 2: 起草新的 Section 5 结构**

需要包含以下固定骨架：
- “为什么 Skills 比 MCP 更高频”
- “前端开发最常用的 Skills”
- “Skill 工作流示例”
- “MCP tools 的角色与代表场景”

Expected: 新结构与设计文档一致，不再把 Skills 当成附属补充

- [ ] **Step 3: 修改第10课正文**

实现要求：
- 标题升级为 “常用 Skills + MCP tools”
- 加入高频 Skills 清单与能力标签
- 加入一条从需求到交付的工作流
- 保留 GitHub / Linear / Sentry / Context7 / Firecrawl 等 MCP 代表例子
- 控制节奏，避免 20 分钟内容失控

- [ ] **Step 4: 自查第10课内容的一致性**

检查：
- Section 标题是否前后一致
- “Skill vs MCP” 角色定义是否清楚
- 是否突出常用 Skills，而非零散列举
- 是否与设计文档保持一致

## Chunk 2: 第8课 Skills 内容补强

### Task 2: 补强第8课 Section 3 的高频 Skills 视角

**Files:**
- Modify: `第8课-AI编程工具/final-content.md`
- Reference: `docs/superpowers/specs/2026-03-31-skills-mcp-course-design.md`

- [ ] **Step 1: 读取第8课当前 Skills 章节**

Run: 读取 `第8课-AI编程工具/final-content.md` 中 `Section 3` 相关内容  
Expected: 明确已有四大类结构、热门 Skills 表格、工作流图

- [ ] **Step 2: 设计补强点**

必须补入：
- “前端开发最常用 Skills Top 清单”
- “一个前端需求会串起哪些 Skills”

Expected: 补强后保留原有全貌认知，同时增加高频工作流记忆点

- [ ] **Step 3: 修改第8课正文**

实现要求：
- 不推翻原有四大类结构
- 强调高频 Skills：`brainstorming`、`writing-plans`、`react-best-practices`、`typescript-react-patterns`、`state-management`、`systematic-debugging`、`code-review`、`verification-before-completion`、`test-driven-development`、`git-workflow`
- 弱化偏扩展型 Skills 的课堂主讲地位

- [ ] **Step 4: 自查第8课与第10课是否一致**

检查：
- 两课对核心 Skills 的优先级是否一致
- 第8课是否偏“建立全貌”，第10课是否偏“工程化落地”
- 是否共享同一组高频 Skills 主线

## Chunk 3: 统一校对与验证

### Task 3: 跨课统一校对与轻量验证

**Files:**
- Modify: `第10课-工程化与全栈化/final-content.md`
- Modify: `第8课-AI编程工具/final-content.md`
- Reference: `docs/superpowers/specs/2026-03-31-skills-mcp-course-design.md`

- [ ] **Step 1: 通读两课修改后的关键段落**

Expected: 术语一致，技能优先级一致，逻辑递进成立

- [ ] **Step 2: 运行 Markdown 相关轻量检查**

Run: 如果项目没有统一 markdown lint 流程，则至少做结构性检查与人工复核  
Expected: 标题层级、表格、代码块、Mermaid 结构无明显破坏

- [ ] **Step 3: 读取最近编辑文件的 lints**

Run: 使用 `ReadLints` 检查最近修改文件  
Expected: 无新增明显问题；若有简单问题则直接修复

- [ ] **Step 4: 准备进入实现后评审**

Expected: 可以进入 spec compliance 检查、质量 review、最终收尾说明
