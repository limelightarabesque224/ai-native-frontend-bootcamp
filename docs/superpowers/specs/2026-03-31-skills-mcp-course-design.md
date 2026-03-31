# Skills 与 MCP 课程内容强化设计

## 背景

当前课程中已经出现了 Skills 和 MCP 的介绍，但存在两个明显问题：

1. `第8课-AI编程工具/final-content.md` 中的 Skills 内容更偏“分类罗列”，缺少“前端开发高频使用场景”的主线。
2. `第10课-工程化与全栈化/final-content.md` 中 `Section 5：常用 Skills 和 MCP 工具` 对 Skills 的覆盖明显不足，导致听众容易把 MCP 理解为主角，而忽略日常开发里更高频的 Skills。

本次调整的目标不是简单多列几个 Skill 名称，而是让听众建立以下认知：

- Skill 是 AI 的工作流模板，决定“怎么做”
- MCP 是 AI 连接外部系统的接口，决定“能连什么”
- 日常前端开发中，最常用的是规划、编码、调试、测试、Review、交付相关 Skills

## 目标

1. 重写 `第10课` 中相关 section 的讲述顺序，让 “常用 Skills + MCP tools” 成为完整逻辑闭环。
2. 强化 `第8课` 中 Skills 内容，让它从“知识点枚举”升级为“高频工作流地图”。
3. 保持课程原有风格，不做无关扩写，只补强最能提升课堂说服力的部分。

## 方案概述

### 已定方案

本次采用此前确认的“方案 2 + 方案 3”组合，具体含义如下：

- 方案 2：把 `第10课` 原有的 `MCP tools` 讲法升级成“常用 Skills + MCP tools”的并列结构
- 方案 3：在这一节里新增“前端开发最常用 Skills”小节，并按高频开发场景讲，而不是按零散类别讲

对应落地动作：

1. 把 `第10课` 的相关 section 改造成“常用 Skills + MCP tools”
2. 在该 section 中新增“前端开发最常用 Skills”小节，并按高频场景讲解
3. 同时补强 `第8课` 中已有的 Skills 内容，让前后两课形成递进关系

### 设计原则

1. 主讲顺序按“开发场景频率”而不是按“技能分类”
2. Skills 讲“什么时候用、为什么高频、和哪些技能组合”
3. MCP 讲“接到哪些外部系统、解决什么边界问题”
4. 让听众能记住一条完整工作流，而不是只记住若干名词

## 第10课改造设计

### Section 标题调整

保留 `Section 5` 的位置，但将其强化为：

`Section 5：常用 Skills + MCP tools（20 min）`

这样标题就直接表达：这一节不是只列工具，而是在讲 AI-Native 开发里的两类核心能力。

### Section 逻辑顺序

#### 1. 先讲为什么 Skills 比 MCP 更高频

开头先建立一个判断框架：

- Skill = AI 的工作流模板
- MCP = AI 的外部工具连接器
- 大部分前端开发时间花在“需求澄清、写代码、排查问题、验证质量、提交协作”上
- 所以从使用频率看，Skills 往往比 MCP 更高频

这一段的目的，是修正听众“能连很多工具 = 更重要”的直觉。

#### 2. 新增“前端开发最常用的 Skills”小节

按高频场景组织，不再按抽象类别组织。

建议覆盖以下高频 Skills：

- 需求与方案：`brainstorming`、`writing-plans`
- React 开发：`react-best-practices`、`typescript-react-patterns`
- 状态管理：`state-management`
- Bug 排查：`systematic-debugging`
- 测试与验证：`test-driven-development`、`testing-best-practices`、`verification-before-completion`
- 协作与 Review：`code-review`、`requesting-code-review`、`receiving-code-review`
- Git 与交付：`git-workflow`、`finishing-a-development-branch`
- 并行提效：`dispatching-parallel-agents`、`subagent-driven-development`

呈现形式建议：

- 先给一张“最常用 Skills 清单表”
- 再给一条“从需求到交付”的工作流链路

推荐工作流：

`brainstorming -> writing-plans -> react-best-practices / typescript-react-patterns -> state-management -> test-driven-development -> code-review -> git-workflow`

#### 3. 再讲 MCP tools 的位置

保留现有 GitHub / Linear / Sentry / Context7 / Firecrawl 这类例子，但讲法要更清楚：

- 当 AI 要接 GitHub、任务系统、监控平台、文档源、浏览器环境时，需要 MCP
- MCP 扩展的是 AI 的“行动边界”
- Skill 规范的是 AI 的“执行方式”

结论要明确：

`Skill 解决流程问题，MCP 解决工具接入问题，两者结合才构成完整的 AI-Native 工作流。`

## 全课程核心 Skills 母表

为避免 `第8课` 和 `第10课` 各讲各的，先定义一张全课程统一母表。后续两个 lesson 只是在这张母表上做不同深度的展开。

| Skill | 能力标签 | 是否进第8课重点 | 是否进第10课重点 | 说明 |
|------|----------|----------------|-----------------|------|
| `brainstorming` | 需求澄清/方案探索 | 是 | 是 | 新任务起点，课堂必须强调 |
| `writing-plans` | 任务拆解/实施规划 | 是 | 是 | 和 brainstorming 组成高频前置组合 |
| `react-best-practices` | React 组件开发 | 是 | 是 | 前端写组件最高频能力之一 |
| `typescript-react-patterns` | 类型安全/组件类型 | 是 | 是 | 与 React 开发天然成对出现 |
| `state-management` | 请求缓存/客户端状态 | 是 | 是 | 贴近日常业务开发 |
| `systematic-debugging` | Bug 排查 | 是 | 是 | 高频且最容易体现 skill 价值 |
| `test-driven-development` | 测试驱动实现 | 是 | 是 | 质量保障主线之一 |
| `testing-best-practices` | 测试设计/测试质量 | 补充 | 是 | 第10课可并入质量闭环 |
| `verification-before-completion` | 完成前验证 | 是 | 是 | 强调“不要口头宣布完成” |
| `code-review` | 评审与风险识别 | 是 | 是 | 提交前必讲 |
| `requesting-code-review` | 主动发起评审 | 补充 | 是 | 作为协作收尾能力 |
| `receiving-code-review` | 处理 review 反馈 | 补充 | 是 | 放在团队协作语境下 |
| `git-workflow` | 提交与分支规范 | 是 | 是 | 与交付直接相关 |
| `finishing-a-development-branch` | 分支收尾/集成选择 | 补充 | 是 | 放在收尾阶段讲 |
| `dispatching-parallel-agents` | 并行提效 | 补充 | 是 | 体现效率提升 |
| `subagent-driven-development` | 多 agent 执行计划 | 补充 | 是 | 作为进阶提效能力 |

> 讲课时，每个 Skill 都要同时给出“能力标签”，避免学员只记住英文 id，不理解背后的能力类型。

## 第8课补强设计

### 保留现有内容

保留现有“四大类别”框架，因为它适合建立全貌认知。

### 强化方向

在不推翻现有结构的前提下，新增两个更贴近课堂记忆点的小节。

#### 1. 新增“前端开发最常用 Skills Top 清单”

建议以“日常使用频率”排序，而不是以类别排序。

建议优先突出：

1. `brainstorming`
2. `writing-plans`
3. `react-best-practices`
4. `typescript-react-patterns`
5. `state-management`
6. `systematic-debugging`
7. `code-review`
8. `verification-before-completion`
9. `test-driven-development`
10. `git-workflow`

这样可以直接回应“现在介绍的不是常用的”这个问题。

#### 2. 新增“一个前端需求会串起哪些 Skills”

用一个真实前端需求例子串起来，例如：

- 新增一个用户搜索弹窗
- 先澄清需求：`brainstorming`
- 再拆任务：`writing-plans`
- 写组件：`react-best-practices`
- 处理类型：`typescript-react-patterns`
- 管理请求与缓存：`state-management`
- 写测试：`test-driven-development`
- 完成前验证：`verification-before-completion`
- 提交前 Review：`code-review`
- 最后规范提交：`git-workflow`

这一段会比单纯列定义更容易被课堂吸收。

### 需要弱化的内容

以下内容可保留在补充表格中，但不应作为主讲重点：

- `create-skill`
- `find-skills`
- `self-improving-agent`
- 其他偏扩展、偏元能力的 skill

原因是它们不是大多数前端开发者的日常高频使用项。

## 内容风格要求

1. 继续沿用课程现有的中文口语化讲解风格
2. 表格和 Mermaid 图可以保留，但要服务于“高频场景”主线
3. 避免把 Skill 部分写成工具百科
4. 每个 Skill 只讲最关键的一句话：什么时候用、解决什么问题

## 第7课边界说明

用户当前诉求集中在“`MCP tools` 那里加入常用 Skills 的内容”，本次**必改**放在 `第10课`，并同步补强 `第8课`。

对于 `第7课-MCP-Tools/final-content.md`，本次不做主体重写，但需要在最终实现时判断是否补一小段收束性提示。优先级如下：

1. 若 `第10课` 已充分建立“Skill vs MCP”的分工关系，则 `第7课` 可以不改
2. 若 `第7课` 当前结尾容易让学员形成“AI 能力主要来自 MCP”的单一印象，则可选补 1 段过渡语，提示“真正日常高频的是 Skills，MCP 是外部接入能力”

这样可以避免后续实施者误以为“第 7 课必须大改”，也避免完全忽略它带来的叙事断层。

## 时间预算与讲述优先级

`第10课` 这一节当前标注为 20 分钟，扩写后必须控制重点，避免重新变成工具名词堆砌。

建议强制优先级如下：

1. 必讲：Skill 与 MCP 的角色区别
2. 必讲：前端开发最常用 Skills 清单
3. 必讲：一条从需求到交付的 Skills 工作流
4. 必讲：3 个 MCP 代表场景（代码仓库、监控、文档/网页）
5. 可略讲：其他 MCP 例子、进阶型 Skills

如果正文篇幅超出，应优先压缩“更多例子”，而不是压缩“常用 Skills 主线”。

## 呈现方式要求

为增强课程可迁移性，正文里不要只给 Skill id，还要给“能力标签”：

- `brainstorming`：需求澄清 / 方案探索
- `writing-plans`：任务拆解 / 实施规划
- `systematic-debugging`：系统化排障
- `code-review`：风险审查 / 提交前把关

要让学员理解：即使他使用的 AI 工具里名字不同，也应该去找同类能力，而不是死记某个 slug。

## 文件变更范围

### 必改文件

- `第10课-工程化与全栈化/final-content.md`
- `第8课-AI编程工具/final-content.md`

### 改动边界

- 不改动课程总主题
- 不改动其他 lesson 的主体结构
- 不扩展到新的大型章节
- 只强化与 Skills / MCP 相关的现有 section

## 验收标准

调整完成后，应满足以下标准：

1. 听众能清楚区分 Skill 与 MCP 的角色
2. 听众能说出 5-8 个前端开发中真正高频的 Skills
3. 第10课中 Skills 不再是 MCP 的附属补充，而是并列核心内容
4. 第8课中 Skills 讲法不再只是分类说明，而是包含高频工作流视角
5. 整体表达仍然适合培训课件，不像产品说明文档

## 实施建议

实施时建议分两步：

1. 先改 `第10课`，确立“Skills + MCP tools”的新主线
2. 再补 `第8课`，让前面的 Skills 章节和后面的工程化章节相互呼应

这样修改时更容易保持前后逻辑一致。
