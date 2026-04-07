# Codex Switch Snapshot Public Contribution Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前 `codex-switch-snapshot` 收敛成适合公开贡献的公共核心版，并同步发布到本机的 `AICode-Nexus/skills` GitHub 仓库 clone 中。

**Architecture:** 先在当前工作区内完成公共贡献化收敛，包括仓库忽略规则、贡献说明和去个人化文案；再用已存在的 smoke test 与 skill 校验保证功能不回退；最后只把公共核心内容同步到 `/Users/admin/work/skills/codex-switch-snapshot/`，更新目标仓库的 `README.md`，并在确认无误后准备 git 提交与推送。

**Tech Stack:** Markdown、YAML、POSIX shell、ripgrep、git、rsync

---

## Chunk 1: 当前仓库中的公共贡献化收敛

### Task 1: 补仓库级忽略规则与贡献说明

**Files:**
- Create: `.gitignore`
- Create: `.agents/skills/codex-switch-snapshot/references/public-contribution-notes.md`

- [ ] **Step 1: 写最小 `.gitignore`**

要求：
- 忽略 `.codex-switch-snapshot/`
- 忽略 `.codex-shared/`
- 忽略 `.codex-backups/`
- 不误伤仓库内的 skill 源文件与测试文件

- [ ] **Step 2: 写贡献说明**

要求：
- 只说明公共层与本地私有层边界
- 列出禁止提交的真实数据类型
- 说明提交前的最小校验命令

### Task 2: 收敛公共 skill 文案

**Files:**
- Modify: `.agents/skills/codex-switch-snapshot/SKILL.md`
- Modify: `.agents/skills/codex-switch-snapshot/references/safety-and-recovery.md`
- Modify: `.agents/skills/codex-switch-snapshot/agents/openai.yaml`

- [ ] **Step 1: 去个人化文案**

要求：
- 强调 `local continuity`
- 强调共享本地会话池
- 强调 auth 与 runtime state 仍保持本地独立
- 不出现“个人神器”“我的账号”这类表达

- [ ] **Step 2: 主入口与高级功能分层**

要求：
- 主入口突出 `init profile`、`install shared pool`、`status`、`snapshot`
- `restore` 与 `unlink` 作为高级能力保留

## Chunk 2: 验证公共核心版

### Task 3: 跑校验，确认能力未回退

**Files:**
- Modify: `tests/codex-switch-snapshot-smoke.sh` if needed
- Modify: `.agents/skills/codex-switch-snapshot/...` as needed

- [ ] **Step 1: 运行 smoke test**

Run: `bash tests/codex-switch-snapshot-smoke.sh`
Expected: PASS

- [ ] **Step 2: 运行 skill 校验**

Run: `python3 /Users/admin/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/codex-switch-snapshot`
Expected: `Skill is valid!`

- [ ] **Step 3: 人工检查贡献边界**

Run: `rg -n "我的|个人神器|my account|my api key|ydliu2|code.iflytek.com" .agents/skills/codex-switch-snapshot docs/superpowers/specs/2026-04-07-codex-switch-snapshot-public-contribution-design.md`
Expected: 不出现面向公开仓库不合适的个人化文案

## Chunk 3: 同步到 `AICode-Nexus/skills`

### Task 4: 准备目标仓库中的公共核心目录

**Files:**
- Create: `/Users/admin/work/skills/codex-switch-snapshot/SKILL.md`
- Create: `/Users/admin/work/skills/codex-switch-snapshot/scripts/`
- Create: `/Users/admin/work/skills/codex-switch-snapshot/references/`
- Modify: `/Users/admin/work/skills/README.md`

- [ ] **Step 1: 只同步公共核心内容**

要求：
- 同步 `SKILL.md`
- 同步 `scripts/`
- 同步 `references/`
- 不同步 `agents/openai.yaml`

- [ ] **Step 2: 更新目标仓库 README**

要求：
- 在 Skills 列表中新增 `codex-switch-snapshot`
- 用简短描述说明它面向本地连续性、共享会话池和快照兜底

- [ ] **Step 3: 检查目标仓库状态**

Run: `git -C /Users/admin/work/skills status --short`
Expected: 只出现 `codex-switch-snapshot/` 和 `README.md` 等本次预期改动

## Chunk 4: 发布前校验与交付

### Task 5: 发布前检查并准备 git 动作

**Files:**
- Modify: `/Users/admin/work/skills/...` as needed

- [ ] **Step 1: 抽样检查目标仓库文件**

Run: `sed -n '1,220p' /Users/admin/work/skills/codex-switch-snapshot/SKILL.md && echo '---' && sed -n '1,220p' /Users/admin/work/skills/README.md`
Expected: 文案简洁、无本地私有层内容、无 `agents/openai.yaml` 依赖

- [ ] **Step 2: 告知用户发布状态**

要求：
- 说明公共核心版已经同步到目标仓库 clone
- 说明哪些内容没有被带过去
- 如果需要 git 提交 / 推送，再继续执行
