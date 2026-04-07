# Codex Switch Snapshot Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 落地一个可团队分发且适合个人长期本机使用的 `codex-switch-snapshot` skill，支持共享本地会话池、`safe` / `full` 快照与恢复，并在当前仓库保留源文件、在本机验证其可用性。

**Architecture:** 先用 skill-creator 的脚手架在仓库中创建标准 skill 目录，再用一个独立 smoke test 脚本对快照、恢复、共享池安装、状态检查和解绑流程做 TDD 式校验，随后补齐 `SKILL.md`、shell 脚本和参考文档，最后运行验证脚本与 skill 校验脚本，并在条件允许时同步到本机技能目录。

**Tech Stack:** Markdown、YAML、POSIX shell、Python 3、ripgrep

---

## Chunk 1: Skill 脚手架与测试骨架

### Task 1: 创建 skill 目录与基础文件

**Files:**
- Create: `.agents/skills/codex-switch-snapshot/SKILL.md`
- Create: `.agents/skills/codex-switch-snapshot/agents/openai.yaml`
- Create: `.agents/skills/codex-switch-snapshot/scripts/`
- Create: `.agents/skills/codex-switch-snapshot/references/`

- [ ] **Step 1: 用初始化脚本创建 skill 骨架**

Run: `python3 /Users/admin/.codex/skills/.system/skill-creator/scripts/init_skill.py codex-switch-snapshot --path ./.agents/skills --resources scripts,references --interface display_name="Codex Switch Snapshot" --interface short_description="Backup Codex state before auth changes" --interface default_prompt="Use $codex-switch-snapshot to snapshot my local Codex state before switching accounts or API keys."`
Expected: `.agents/skills/codex-switch-snapshot/` 目录创建成功，包含 `SKILL.md`、`agents/openai.yaml`、`scripts/`、`references/`

- [ ] **Step 2: 检查脚手架文件是否齐全**

Run: `find .agents/skills/codex-switch-snapshot -maxdepth 3 | sort`
Expected: 目录结构完整，无多余示例占位文件

### Task 2: 写 smoke test 骨架并先看它失败

**Files:**
- Create: `tests/codex-switch-snapshot-smoke.sh`

- [ ] **Step 1: 写最小 smoke test**

要求：
- 在临时目录创建模拟 `~/.codex`
- 写入最小样本：`session_index.jsonl`、`sessions/`、`archived_sessions/`、`.codex-global-state.json`、`auth.json`、`config.toml`
- 调用尚未实现的 `codex_snapshot.sh` 与 `codex_restore.sh`
- 断言 `safe` 不包含认证文件，`full` 包含认证文件
- 断言恢复前会生成 `pre-restore` 快照

- [ ] **Step 2: 运行 smoke test，确认在脚本未实现时失败**

Run: `bash tests/codex-switch-snapshot-smoke.sh`
Expected: FAIL，原因应为脚本缺失或行为未实现，而不是测试脚本本身语法错误

## Chunk 2: Skill 内容与脚本实现

### Task 3: 实现 `SKILL.md`、参考文档和公共 shell 库

**Files:**
- Modify: `.agents/skills/codex-switch-snapshot/SKILL.md`
- Create: `.agents/skills/codex-switch-snapshot/references/safety-and-recovery.md`
- Create: `.agents/skills/codex-switch-snapshot/scripts/codex_snapshot_lib.sh`

- [ ] **Step 1: 完成 `SKILL.md`**

要求：
- 前置说明只写触发条件和适用场景
- 默认推荐 `safe`
- 明确 `full` 的敏感信息风险
- 明确不处理云端迁移和环境变量型 API key
- 给出快照、恢复、模式选择的标准工作流

- [ ] **Step 2: 完成 `safety-and-recovery.md`**

要求：
- 补充风险说明
- 说明 `safe` 与 `full` 的边界
- 提供恢复前后的检查建议

- [ ] **Step 3: 实现公共 shell 函数**

要求：
- 统一路径解析
- 标签合法化
- manifest 生成
- 文件复制与校验辅助函数

### Task 4: 实现快照与恢复脚本

**Files:**
- Create: `.agents/skills/codex-switch-snapshot/scripts/codex_snapshot.sh`
- Create: `.agents/skills/codex-switch-snapshot/scripts/codex_restore.sh`

- [ ] **Step 1: 实现 `codex_snapshot.sh`**

要求：
- 支持 `safe` 和 `full`
- 支持通过 `CODEX_HOME` 或 `HOME` 定位 `.codex`
- 输出快照目录、模式与摘要
- 生成 `manifest.json` 和 `checksums.txt`

- [ ] **Step 2: 实现 `codex_restore.sh`**

要求：
- 从 `manifest.json` 读取模式与内容
- 恢复前自动创建 `pre-restore` 快照
- 支持 `--mode safe|full`
- 防止静默覆盖

- [ ] **Step 3: 给脚本加执行权限**

Run: `chmod +x .agents/skills/codex-switch-snapshot/scripts/*.sh tests/codex-switch-snapshot-smoke.sh`
Expected: 所有脚本可直接执行

## Chunk 3: 验证、校验与本机安装

### Task 5: 执行验证并修正问题

**Files:**
- Modify: `tests/codex-switch-snapshot-smoke.sh`
- Modify: `.agents/skills/codex-switch-snapshot/...` as needed

- [ ] **Step 1: 运行 smoke test**

Run: `bash tests/codex-switch-snapshot-smoke.sh`
Expected: PASS

- [ ] **Step 2: 运行 skill 结构校验**

Run: `python3 /Users/admin/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/codex-switch-snapshot`
Expected: 校验通过

- [ ] **Step 3: 人工检查关键输出**

Run: `sed -n '1,220p' .agents/skills/codex-switch-snapshot/SKILL.md && echo '---' && sed -n '1,220p' .agents/skills/codex-switch-snapshot/references/safety-and-recovery.md`
Expected: 文案与设计一致，无占位文本

### Task 6: 同步到本机 `~/.codex/skills` 并验证可见性

**Files:**
- Create: `~/.codex/skills/codex-switch-snapshot/` via copy

- [ ] **Step 1: 复制 skill 到本机技能目录**

Run: `rsync -a --delete .agents/skills/codex-switch-snapshot/ ~/.codex/skills/codex-switch-snapshot/`
Expected: 本机技能目录中出现同名 skill，可供当前环境直接使用

- [ ] **Step 2: 列出目录确认同步成功**

Run: `find ~/.codex/skills/codex-switch-snapshot -maxdepth 3 | sort`
Expected: 与仓库中的 skill 目录一致
