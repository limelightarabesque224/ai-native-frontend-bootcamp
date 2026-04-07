# Codex Switch Snapshot Skill 设计文档

## 背景

在 Codex 桌面端或相关运行环境中切换账号、OAuth 登录态或 API key 认证方式时，用户经常会遇到一个高频问题：

1. 切换后当前界面看不到之前的会话，误以为本地会话已经丢失。
2. 不清楚哪些数据属于“会话与本地状态”，哪些属于“认证信息”。
3. 有些用户是账号登录，有些用户使用 API key，还有一部分用户处于混合认证场景，导致切换前的准备动作不一致。
4. 团队内部通常没有统一的切换前备份流程，大家容易靠手工复制文件，既不稳定，也容易误备份敏感认证数据。

当前本机 `~/.codex` 目录已经显示出这类问题的现实基础，例如：

- `session_index.jsonl`
- `sessions/`
- `archived_sessions/`
- `.codex-global-state.json`
- `auth.json`
- `config.toml`

这说明“切换后看不到旧会话”并不等于本地文件一定被删除。更常见的情况是账号隔离、认证状态变化或本地状态切换后未恢复。

## 目标

设计并实现一个可团队分发、但首先服务个人本机长期使用的 skill：`codex-switch-snapshot`，用于在切换 Codex 账号或认证方式之前保护本地状态，并在需要时通过共享本地会话池维持跨账号 / 跨 API key 的本地连续性。

该 skill 需要满足：

1. 默认提供安全的 `safe` 快照模式，只备份会话与本地状态，不碰敏感认证信息。
2. 提供显式可选的 `full` 快照模式，在用户明确需要时才纳入认证相关文件。
3. 同时覆盖三类切换场景：账号/OAuth 切换、API key 切换、混合认证切换。
4. 提供恢复能力，但恢复前必须自动保护当前状态，避免误覆盖后无法回退。
5. 支持一次安装共享会话池，后续切换账号或 API key 时尽量不需要重复快照初始化。
6. 形成适合团队传播的统一工作流、命名规范、风险提示和使用文案。

## 非目标

以下内容不纳入该 skill 的一期范围：

1. 不负责跨 OpenAI 账号迁移云端聊天历史。
2. 不合并不同账号之间的会话历史。
3. 不自动监听 GUI 中的切换动作。
4. 不自动替用户执行登录、退出或切账号操作。
5. 不自动接管 shell 环境变量中的 API key，例如 `.zshrc`、`.bashrc`、`.env`。
6. 不直接操作 sqlite 数据库做“账号合并”或“强行恢复”。

## 核心定位

本 skill 的本质不是“账号迁移工具”，而是“本地状态连续性工具”。

推荐命名：

`codex-switch-snapshot`

选择该名称的原因：

1. “switch” 能覆盖账号切换与认证方式切换。
2. “snapshot” 比 “backup” 更准确，强调它保留的是某一时刻的本地状态切片。
3. 不把能力错误收窄为单纯的“账号切换”，从而天然兼容 API key 用户。

## 用户场景

### 场景 1：账号 / OAuth 切换

用户当前以账号方式登录 Codex，准备退出当前账号并切到另一个账号。此时最常见的诉求是：

- 保住当前本地会话索引和会话目录
- 保住本地 workspace 状态与提示历史
- 切换后如果看不到旧会话，能恢复到切换前状态

推荐模式：

`safe`

### 场景 2：API key 切换

用户没有切换 OpenAI 账号，但准备修改 API key 或与 API key 相关的本地认证配置。此时会涉及：

- 本地会话状态备份
- 可选保留认证配置文件
- 明确哪些敏感文件不能随意共享

推荐模式：

- 默认仍先建议 `safe`
- 只有在用户明确要求完整恢复认证状态时，才建议 `full`

### 场景 3：混合场景

用户的本机环境可能同时存在：

- 账号登录态
- 本地 `auth.json`
- 本地 `config.toml`
- shell 中的环境变量型 API key

此时 skill 必须明确区分：

1. 哪些东西会被快照
2. 哪些东西不会被快照
3. 哪些东西需要用户手动检查

## 方案概述

### 已定方案

本次采用“共享本地会话池 + 双模式快照兜底”的方案。

核心设计如下：

1. skill 提供共享本地会话池安装能力，作为长期使用的默认方案。
2. skill 保留 `safe` 和 `full` 两种快照模式，作为兜底与恢复能力。
3. skill 默认推荐 `safe`，`full` 仅在用户明确需要时使用。
4. skill 不做自动监听，但安装完成后尽量做到后续切换无需重复初始化。
5. skill 提供恢复能力，但恢复前必须先生成当前状态的保护快照。
6. skill 既包含 `SKILL.md` 指南，也包含可直接执行的脚本。

### 为什么不做自动触发

自动化切换在一期不合适，原因如下：

1. GUI 切换、OAuth 切换、API key 修改和 shell 环境变量修改的触发信号不统一。
2. 误判与漏判风险较高。
3. 团队用户更需要稳定和可解释的流程，而不是隐式自动化。
4. 手动入口更容易形成标准操作习惯。

## Skill 目录结构

建议目录结构如下：

```text
codex-switch-snapshot/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
│   ├── codex_init_local_profile.sh
│   ├── codex_install_shared_pool.sh
│   ├── codex_shared_pool_status.sh
│   ├── codex_unlink_shared_pool.sh
│   ├── codex_snapshot.sh
│   ├── codex_restore.sh
│   └── codex_snapshot_lib.sh
└── references/
    └── safety-and-recovery.md
```

目录职责如下：

- `SKILL.md`
  负责触发条件、模式选择、操作流程、风险边界和使用文案。
- `agents/openai.yaml`
  负责 skill 的 UI 展示元数据。
- `scripts/codex_snapshot.sh`
  负责生成 `safe` / `full` 快照。
- `scripts/codex_restore.sh`
  负责从指定快照恢复本地状态。
- `scripts/codex_init_local_profile.sh`
  负责初始化只保留在本机的私有 profile。
- `scripts/codex_install_shared_pool.sh`
  负责安装或修复共享会话池软链接。
- `scripts/codex_shared_pool_status.sh`
  负责检查共享池是否处于启用状态。
- `scripts/codex_unlink_shared_pool.sh`
  负责将软链接恢复成普通本地文件与目录。
- `scripts/codex_snapshot_lib.sh`
  负责公共函数，例如目录校验、快照命名、文件拷贝、摘要生成。
- `references/safety-and-recovery.md`
  负责详细说明安全边界、恢复说明和常见误区。

## 共享本地会话池设计

### 目标

让用户在同一台机器上切换账号、OAuth 或 API key 后，仍然继续使用同一个本地会话池，而不要求每次切换前都重新做初始化。

### 共享池位置

建议共享池根目录为：

`~/.codex-shared/session-pool/`

### 默认共享内容

- `session_index.jsonl`
- `sessions/`
- `archived_sessions/`
- `history.jsonl`（允许通过本地 profile 关闭）

### 明确不共享的内容

- `auth.json`
- `config.toml`
- `.codex-global-state.json`
- `state_*.sqlite`
- `logs_*.sqlite`
- `cache/`
- `tmp/`
- `shell_snapshots/`

这样可以共享“会话池”，但不共享“认证状态”和“易损运行态”。

### 本地私有 profile

为兼顾个人长期使用和公共贡献，用户私有偏好不应写进 skill 仓库主目录，而应写入：

`~/.codex-switch-snapshot/profiles/default.env`

它可以包含：

- 默认快照模式
- 共享池根目录
- 是否共享 `history.jsonl`
- 用户自己的备注或标签

该 profile 只保留在本机，不作为公共 skill 的一部分分发。

## 快照模式设计

### 模式 1：`safe`

这是默认模式，也是 skill 的推荐入口。

目标：

- 保住会话与本地状态
- 不纳入敏感认证配置
- 适合大多数账号切换和普通用户

建议包含：

- `~/.codex/session_index.jsonl`
- `~/.codex/sessions/`
- `~/.codex/archived_sessions/`
- `~/.codex/history.jsonl`
- `~/.codex/.codex-global-state.json`
- `~/.codex/memories/`
- `~/.codex/rules/`
- `~/.codex/automations/`

建议排除：

- `~/.codex/auth.json`
- `~/.codex/config.toml`
- `~/.codex/state_*.sqlite`
- `~/.codex/logs_*.sqlite`
- `~/.codex/*-wal`
- `~/.codex/*-shm`
- `~/.codex/cache/`
- `~/.codex/tmp/`
- `~/.codex/shell_snapshots/`

### 模式 2：`full`

这是显式升级模式，只在用户明确需要“完整恢复本地认证状态”时启用。

目标：

- 在 `safe` 基础上，额外保留认证相关配置
- 服务于 API key 用户或混合认证场景

在 `safe` 基础上，额外建议纳入：

- `~/.codex/auth.json`
- `~/.codex/config.toml`

仍然建议排除：

- `state_*.sqlite`
- `logs_*.sqlite`
- `*-wal`
- `*-shm`

原因：

1. 这些文件体积较大且易变化。
2. 它们更容易造成恢复后一致性问题。
3. 第一期的目标是稳定恢复“会话索引 + 目录状态”，而不是做整目录镜像。

## 快照命名与输出约定

建议将所有快照统一输出到：

`~/.codex-backups/`

单次快照目录格式建议为：

`~/.codex-backups/<timestamp>-<mode>-<label>/`

示例：

- `~/.codex-backups/20260407-103500-safe-work-oauth-before-switch/`
- `~/.codex-backups/20260407-104200-full-personal-apikey-q2/`

每个快照目录建议包含：

- `manifest.json`
- `checksums.txt`
- `files/`

其中：

- `manifest.json` 记录模式、标签、时间、来源目录、包含文件和排除文件
- `checksums.txt` 记录摘要，便于校验
- `files/` 存放实际快照内容

## 脚本接口设计

建议对外暴露以下命令：

```bash
codex_init_local_profile.sh
codex_install_shared_pool.sh
codex_shared_pool_status.sh
codex_unlink_shared_pool.sh
codex_snapshot.sh safe <label>
codex_snapshot.sh full <label>
codex_restore.sh <snapshot-dir> --mode safe
codex_restore.sh <snapshot-dir> --mode full
```

### `codex_snapshot.sh`

职责：

1. 校验 `~/.codex` 是否存在
2. 校验模式是否合法
3. 生成目标快照目录
4. 拷贝允许纳入的文件和目录
5. 生成 `manifest.json`
6. 生成 `checksums.txt`
7. 在标准输出中返回快照位置、模式与摘要

### `codex_restore.sh`

职责：

1. 校验目标快照目录是否合法
2. 读取 `manifest.json`
3. 恢复前先创建一个 `pre-restore` 当前状态保护快照
4. 根据指定模式恢复允许恢复的文件
5. 默认不做静默覆盖，至少输出覆盖清单与恢复结果摘要

## 恢复策略

恢复流程必须遵守以下原则：

1. 任何恢复动作前先做当前状态保护快照。
2. `safe` 快照只恢复 `safe` 范围内的文件。
3. `full` 恢复才允许恢复 `auth.json` 和 `config.toml`。
4. 如果用户只想找回会话，不建议直接恢复认证文件。
5. 恢复结束后要明确告知用户：如果 API key 来自环境变量，该 skill 没有接管这部分内容。

## 团队分发时的默认文案

skill 对团队用户的默认引导语建议包含以下几条：

1. “大多数场景请先用 `safe`。”
2. “只有明确要保留本地认证状态时，才使用 `full`。”
3. “`full` 可能包含敏感认证信息，不要随意分享、上传或提交到仓库。”
4. “如果切换后看不到旧会话，先判断是账号隔离还是本地状态变化，不要直接认为文件已丢失。”
5. “本 skill 不处理 shell 环境变量里的 API key，请自行检查 `.zshrc`、`.bashrc`、`.env` 等位置。”

## 触发词设计

建议 `SKILL.md` 在描述中覆盖以下触发语义：

- 切换 Codex 账号前先备份
- 保住本地会话再换账号
- 切换 API key 前做快照
- 备份当前 `~/.codex` 状态
- 恢复某个 Codex 切换前快照

这样可以同时覆盖自然语言说法和实际问题导向。

## 错误处理要求

脚本需要对以下场景做清晰提示：

1. `~/.codex` 目录不存在
2. 快照模式非法
3. 标签为空或含非法字符
4. 目标快照目录已存在
5. 快照目录缺少 `manifest.json`
6. 恢复模式与快照模式不匹配
7. 目标文件不存在但用户要求恢复

错误信息要求：

1. 用清晰中文输出
2. 能说明“为什么不能继续”
3. 能提示用户下一步应该怎么做

## 安全边界

必须在 skill 和参考文档中反复强调：

1. `safe` 是默认推荐模式。
2. `full` 含有敏感认证信息风险。
3. 快照目录不应默认进入 Git 仓库。
4. 不要把 `full` 快照发送给他人或上传到共享空间。
5. 不要把该 skill 理解为“云端会话迁移工具”。

## 验证策略

该 skill 落地后至少需要验证以下场景：

1. 在存在真实 `~/.codex` 目录的机器上执行 `safe` 快照，验证快照目录和清单生成正常。
2. 在真实环境中执行 `full` 快照，验证 `auth.json` 和 `config.toml` 被正确纳入。
3. 用 `safe` 快照做恢复，验证 `session_index.jsonl`、`sessions/` 和 `archived_sessions/` 能恢复到目标位置。
4. 验证恢复前自动创建 `pre-restore` 快照。
5. 安装共享池后，验证共享路径被软链接到共享池根目录。
6. 验证 `status` 能正确报告共享池状态。
7. 验证 `unlink` 能将软链接恢复成普通本地文件与目录。
8. 验证非法模式、缺失目录和标签非法等错误场景。

## 实施建议

后续实现时建议分两步进行：

1. 先完成最小可用版本：
   - `SKILL.md`
   - `codex_snapshot.sh`
   - `codex_restore.sh`
   - `safety-and-recovery.md`
2. 再补充：
   - `agents/openai.yaml`
   - 更完整的摘要与校验信息
   - 更友好的恢复提示

## 决策结论

本次确认采用以下最终方案：

1. skill 名称：`codex-switch-snapshot`
2. 形态：个人本机优先、可公共贡献的 skill
3. 长期方案：共享本地会话池
4. 兜底方案：`safe` 默认，`full` 可选的快照与恢复
5. 适用：账号/OAuth 切换、API key 切换、混合认证切换
6. 范围：只处理本地连续性，不处理云端迁移与自动切换
