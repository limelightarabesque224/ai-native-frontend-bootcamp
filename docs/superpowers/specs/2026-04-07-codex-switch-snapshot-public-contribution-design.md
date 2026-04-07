# Codex Switch Snapshot 公共贡献化设计文档

## 背景

当前 `codex-switch-snapshot` 已经具备以下核心能力：

1. `safe` / `full` 本地快照与恢复
2. 共享本地会话池安装、状态检查与解绑
3. 本地私有 profile 初始化

这版能力已经足够支撑个人在同一台机器上切换账号、OAuth 与 API key 时维持本地连续性，并且已经在真实本机环境中完成验证。

但如果要把它进一步收敛成“适合公开贡献”的版本，当前仍然存在三个问题：

1. 文案上仍然更偏“个人本机长期使用工具”，还没有完全收敛成“任何 Codex 用户都能理解和采用”的公共表达。
2. 仓库层还缺少明确的忽略规则，容易把本地 profile、共享池或快照样本误纳入版本控制。
3. 还缺少一份面向贡献者的短说明，用来明确哪些内容属于公共层，哪些内容必须留在本地私有层。

## 目标

在不破坏当前功能和本机可用性的前提下，把 `codex-switch-snapshot` 收敛为一个更适合公开贡献和复用的 skill。

本次收敛需要达到：

1. 保留单一 skill 形态，不拆成两个 skill。
2. 明确区分公共层与本地私有层。
3. 补齐仓库级忽略规则，避免误提交本地数据。
4. 增加轻量贡献说明，不引入过重文档体系。
5. 统一文案语气，让 skill 面向“任何 Codex 用户”而不是某个特定个人。
6. 保持现有脚本接口与 smoke test 行为稳定。

## 非目标

本次不做以下事情：

1. 不改变共享池与 snapshot/restore 的核心机制。
2. 不修改共享边界，不新增共享认证文件。
3. 不引入云端同步、账号迁移或自动监听能力。
4. 不增加新的复杂安装系统、包管理器或发布流程。
5. 不拆分出第二个专门的“个人私有 skill”。

## 设计原则

### 1. 一个 skill，两个层次

继续保留单一 skill：`codex-switch-snapshot`

但在设计上明确拆成两层：

- 公共层：可贡献、可复用、适合任何 Codex 用户
- 本地私有层：运行时自动生成，只存在于用户本机

### 2. 共享本地连续性，不共享个人身份

该 skill 的公共价值在于：

- 共享本地会话池
- 保护本地连续性
- 在切换账号或 API key 时减少会话“看起来丢失”的问题

而不在于：

- 用户是谁
- 用户有哪些账号标签
- 用户使用哪些供应商
- 用户如何命名自己的 profile

### 3. 文案中始终强调边界

公开贡献版必须持续强调：

- 这是本地连续性工具
- 不是云端迁移工具
- 共享的是本地会话池
- 认证和运行态仍保持本地独立

## 公共层与本地私有层边界

### 公共层保留内容

以下内容属于 skill 仓库内的公共能力，应保留：

- `codex_init_local_profile.sh`
- `codex_install_shared_pool.sh`
- `codex_shared_pool_status.sh`
- `codex_unlink_shared_pool.sh`
- `codex_snapshot.sh`
- `codex_restore.sh`
- `codex_snapshot_lib.sh`
- `SKILL.md`
- `references/safety-and-recovery.md`
- `agents/openai.yaml`

这些内容表达的是：

- 通用工作流
- 通用路径约定
- 通用恢复与回退能力
- 通用风险边界

### 本地私有层保留内容

以下内容应继续只生成在用户 `HOME` 下，不进入 skill 仓库：

- `~/.codex-switch-snapshot/profiles/default.env`
- `~/.codex-shared/session-pool/`
- `~/.codex-backups/`

它们分别承担：

- 本地私有偏好
- 本地共享会话池数据
- 本地备份快照

### 明确不应进入公共 skill 的信息

以下信息不能进入 skill 仓库或文案示例：

- 真实账号标签
- 真实 API key 或 token
- 真实用户目录偏好
- 真实 MCP 密钥配置
- 与某个个人使用习惯强绑定的命名方式

## 主入口与高级功能分层

### 公开主入口

公开版应把以下命令作为主入口强调：

1. `codex_init_local_profile.sh`
2. `codex_install_shared_pool.sh`
3. `codex_shared_pool_status.sh`
4. `codex_snapshot.sh`

原因：

- 能形成最自然的理解路径
- 对普通用户最友好
- 能突出“先装共享池，再把快照当安全网”的产品主线

### 高级功能

以下命令继续保留，但在文档中降级为高级功能或恢复能力：

1. `codex_restore.sh`
2. `codex_unlink_shared_pool.sh`

原因：

- 它们更偏回退与纠错动作
- 不应压过“共享池安装”和“本地连续性”这条主线

## 文案收敛要求

### 目标语气

公开贡献版的文案应满足：

- 面向任何 Codex 用户
- 不使用“我自己的工具”“个人切号工具”等表述
- 不强调个人风格
- 更像一个通用、本地优先、边界清晰的工具型 skill

### 核心对外表述

推荐对外核心表述收敛为：

`Keep local Codex conversations continuous across account or API key changes by sharing only the local conversation pool, while leaving auth and runtime state local.`

这句话明确表达了：

1. 目标是本地连续性
2. 共享的是本地会话池
3. 认证和运行态不共享

### 文案中应避免的表达

- “我的账号”
- “我的 API key”
- “给我自己切号用”
- “个人神器”
- 任何带明显个人色彩或夸张宣传色彩的说法

## 仓库级忽略规则

为适合公开贡献，仓库根应增加最小 `.gitignore`。

建议至少忽略：

- `.codex-switch-snapshot/`
- `.codex-shared/`
- `.codex-backups/`

这样可以防止：

- 误提交本地私有 profile
- 误提交本地共享会话池内容
- 误提交快照与恢复产物

## 贡献说明设计

不建议新增沉重的顶层贡献文档。

推荐新增：

`references/public-contribution-notes.md`

该文件只需要覆盖：

1. 什么属于公共层
2. 什么必须保留在本地私有层
3. 哪些真实数据绝不能提交
4. 提交前应运行哪些校验

这样既能满足贡献说明需求，又不会把 skill 变成重文档项目。

## 验证要求

公共贡献化收敛后，至少要重新确认以下检查通过：

1. `bash tests/codex-switch-snapshot-smoke.sh`
2. `python3 /Users/admin/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/codex-switch-snapshot`
3. 人工检查 `SKILL.md`、`references/` 和 `openai.yaml` 中不存在个人化标签与真实敏感信息示例

## 实施范围

本次只做“收敛与整理”，不做功能重构。

需要调整的文件预计包括：

- `.agents/skills/codex-switch-snapshot/SKILL.md`
- `.agents/skills/codex-switch-snapshot/references/safety-and-recovery.md`
- `.agents/skills/codex-switch-snapshot/references/public-contribution-notes.md`
- `.agents/skills/codex-switch-snapshot/agents/openai.yaml`
- 仓库根 `.gitignore`

## 决策结论

本次公共贡献化采用以下最终方向：

1. 保持单 skill 结构，不拆分
2. 明确“公共层 + 本地私有层”的边界
3. 公开主入口强调共享池安装与状态检查
4. `restore` 与 `unlink` 保持高级功能定位
5. 通过 `.gitignore` 与简短贡献说明控制泄漏风险
6. 在不改变现有能力的前提下，使 skill 更适合公开贡献
