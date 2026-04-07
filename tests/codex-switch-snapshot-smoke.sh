#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SKILL_DIR="${REPO_ROOT}/.agents/skills/codex-switch-snapshot"
SNAPSHOT_SCRIPT="${SKILL_DIR}/scripts/codex_snapshot.sh"
RESTORE_SCRIPT="${SKILL_DIR}/scripts/codex_restore.sh"
SHARED_POOL_INSTALL_SCRIPT="${SKILL_DIR}/scripts/codex_install_shared_pool.sh"
SHARED_POOL_STATUS_SCRIPT="${SKILL_DIR}/scripts/codex_shared_pool_status.sh"
SHARED_POOL_UNLINK_SCRIPT="${SKILL_DIR}/scripts/codex_unlink_shared_pool.sh"
LOCAL_PROFILE_SCRIPT="${SKILL_DIR}/scripts/codex_init_local_profile.sh"

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

assert_file_exists() {
  local path="$1"
  [[ -f "$path" ]] || fail "expected file to exist: $path"
}

assert_dir_exists() {
  local path="$1"
  [[ -d "$path" ]] || fail "expected directory to exist: $path"
}

assert_not_exists() {
  local path="$1"
  [[ ! -e "$path" ]] || fail "expected path to be absent: $path"
}

assert_symlink_to() {
  local path="$1"
  local expected_target="$2"
  [[ -L "$path" ]] || fail "expected symlink: $path"
  local actual_target
  actual_target="$(readlink "$path")"
  [[ "$actual_target" == "$expected_target" ]] || fail "expected symlink $path -> $expected_target, got $actual_target"
}

assert_contains() {
  local file="$1"
  local pattern="$2"
  rg -q --fixed-strings "$pattern" "$file" || fail "expected '$pattern' in $file"
}

assert_equals() {
  local left="$1"
  local right="$2"
  [[ "$left" == "$right" ]] || fail "expected '$left' == '$right'"
}

prepare_fake_codex() {
  local codex_root="$1"

  mkdir -p \
    "${codex_root}/sessions/thread-a" \
    "${codex_root}/archived_sessions/thread-z" \
    "${codex_root}/memories" \
    "${codex_root}/rules" \
    "${codex_root}/automations"

  printf '%s\n' '{"thread":"alpha"}' > "${codex_root}/session_index.jsonl"
  printf '%s\n' '{"history":"entry"}' > "${codex_root}/history.jsonl"
  printf '%s\n' '{"workspace":"demo"}' > "${codex_root}/.codex-global-state.json"
  printf '%s\n' 'session-payload' > "${codex_root}/sessions/thread-a/message.txt"
  printf '%s\n' 'archived-payload' > "${codex_root}/archived_sessions/thread-z/message.txt"
  printf '%s\n' 'memory-payload' > "${codex_root}/memories/note.md"
  printf '%s\n' 'rule-payload' > "${codex_root}/rules/policy.md"
  printf '%s\n' 'automation-payload' > "${codex_root}/automations/job.toml"
  printf '%s\n' '{"token":"secret"}' > "${codex_root}/auth.json"
  printf '%s\n' 'model = "gpt-5"' > "${codex_root}/config.toml"
}

latest_snapshot_dir() {
  local backup_root="$1"
  find "$backup_root" -mindepth 1 -maxdepth 1 -type d | sort | tail -n 1
}

[[ -x "${SNAPSHOT_SCRIPT}" ]] || fail "snapshot script is not executable: ${SNAPSHOT_SCRIPT}"
[[ -x "${RESTORE_SCRIPT}" ]] || fail "restore script is not executable: ${RESTORE_SCRIPT}"
[[ -x "${SHARED_POOL_INSTALL_SCRIPT}" ]] || fail "shared pool install script is not executable: ${SHARED_POOL_INSTALL_SCRIPT}"
[[ -x "${SHARED_POOL_STATUS_SCRIPT}" ]] || fail "shared pool status script is not executable: ${SHARED_POOL_STATUS_SCRIPT}"
[[ -x "${SHARED_POOL_UNLINK_SCRIPT}" ]] || fail "shared pool unlink script is not executable: ${SHARED_POOL_UNLINK_SCRIPT}"
[[ -x "${LOCAL_PROFILE_SCRIPT}" ]] || fail "local profile init script is not executable: ${LOCAL_PROFILE_SCRIPT}"

TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "${TMP_ROOT}"' EXIT

export HOME="${TMP_ROOT}/home"
mkdir -p "${HOME}"
CODEX_ROOT="${HOME}/.codex"
BACKUP_ROOT="${HOME}/.codex-backups"

prepare_fake_codex "${CODEX_ROOT}"

SAFE_LABEL="safe-smoke"
"${SNAPSHOT_SCRIPT}" safe "${SAFE_LABEL}" >/tmp/codex-switch-safe.out
SAFE_SNAPSHOT_DIR="$(latest_snapshot_dir "${BACKUP_ROOT}")"
assert_dir_exists "${SAFE_SNAPSHOT_DIR}"
assert_file_exists "${SAFE_SNAPSHOT_DIR}/manifest.json"
assert_file_exists "${SAFE_SNAPSHOT_DIR}/checksums.txt"
assert_file_exists "${SAFE_SNAPSHOT_DIR}/files/session_index.jsonl"
assert_file_exists "${SAFE_SNAPSHOT_DIR}/files/sessions/thread-a/message.txt"
assert_not_exists "${SAFE_SNAPSHOT_DIR}/files/auth.json"
assert_not_exists "${SAFE_SNAPSHOT_DIR}/files/config.toml"
assert_contains "${SAFE_SNAPSHOT_DIR}/manifest.json" "\"mode\": \"safe\""
assert_contains "${SAFE_SNAPSHOT_DIR}/manifest.json" "\"label\": \"${SAFE_LABEL}\""

FULL_LABEL="full-smoke"
"${SNAPSHOT_SCRIPT}" full "${FULL_LABEL}" >/tmp/codex-switch-full.out
FULL_SNAPSHOT_DIR="$(latest_snapshot_dir "${BACKUP_ROOT}")"
assert_dir_exists "${FULL_SNAPSHOT_DIR}"
assert_file_exists "${FULL_SNAPSHOT_DIR}/files/auth.json"
assert_file_exists "${FULL_SNAPSHOT_DIR}/files/config.toml"
assert_contains "${FULL_SNAPSHOT_DIR}/manifest.json" "\"mode\": \"full\""
assert_contains "${FULL_SNAPSHOT_DIR}/manifest.json" "\"label\": \"${FULL_LABEL}\""

printf '%s\n' '{"thread":"mutated"}' > "${CODEX_ROOT}/session_index.jsonl"
rm -rf "${CODEX_ROOT}/sessions"
mkdir -p "${CODEX_ROOT}/sessions"
printf '%s\n' 'new-current-token' > "${CODEX_ROOT}/auth.json"

"${RESTORE_SCRIPT}" "${SAFE_SNAPSHOT_DIR}" --mode safe >/tmp/codex-switch-restore.out
RESTORED_INDEX_CONTENT="$(cat "${CODEX_ROOT}/session_index.jsonl")"
assert_equals "${RESTORED_INDEX_CONTENT}" '{"thread":"alpha"}'
assert_file_exists "${CODEX_ROOT}/sessions/thread-a/message.txt"
assert_contains "${CODEX_ROOT}/auth.json" 'new-current-token'

PRE_RESTORE_DIR_COUNT="$(find "${BACKUP_ROOT}" -mindepth 1 -maxdepth 1 -type d -name '*pre-restore*' | wc -l | tr -d ' ')"
[[ "${PRE_RESTORE_DIR_COUNT}" -ge 1 ]] || fail "expected at least one pre-restore snapshot"

PROFILE_ROOT="${HOME}/.codex-switch-snapshot"
"${LOCAL_PROFILE_SCRIPT}" >/tmp/codex-switch-profile.out
assert_file_exists "${PROFILE_ROOT}/profiles/default.env"
assert_contains "${PROFILE_ROOT}/profiles/default.env" 'CODEX_SWITCH_SNAPSHOT_DEFAULT_MODE=safe'

"${SHARED_POOL_INSTALL_SCRIPT}" >/tmp/codex-switch-install.out
SHARED_ROOT="${HOME}/.codex-shared/session-pool"
assert_dir_exists "${SHARED_ROOT}"
assert_file_exists "${SHARED_ROOT}/session_index.jsonl"
assert_dir_exists "${SHARED_ROOT}/sessions"
assert_dir_exists "${SHARED_ROOT}/archived_sessions"
assert_symlink_to "${CODEX_ROOT}/session_index.jsonl" "${SHARED_ROOT}/session_index.jsonl"
assert_symlink_to "${CODEX_ROOT}/history.jsonl" "${SHARED_ROOT}/history.jsonl"
assert_symlink_to "${CODEX_ROOT}/sessions" "${SHARED_ROOT}/sessions"
assert_symlink_to "${CODEX_ROOT}/archived_sessions" "${SHARED_ROOT}/archived_sessions"
assert_not_exists "${CODEX_ROOT}/auth.json.link"

"${SHARED_POOL_STATUS_SCRIPT}" >/tmp/codex-switch-status.out
assert_contains /tmp/codex-switch-status.out 'Shared pool installed: yes'
assert_contains /tmp/codex-switch-status.out "${SHARED_ROOT}"

printf '%s\n' '{"thread":"shared-after-install"}' > "${SHARED_ROOT}/session_index.jsonl"
assert_contains "${CODEX_ROOT}/session_index.jsonl" '{"thread":"shared-after-install"}'

"${SHARED_POOL_UNLINK_SCRIPT}" >/tmp/codex-switch-unlink.out
[[ ! -L "${CODEX_ROOT}/session_index.jsonl" ]] || fail "expected session_index.jsonl to be restored as plain file"
[[ ! -L "${CODEX_ROOT}/sessions" ]] || fail "expected sessions to be restored as plain directory"
assert_file_exists "${CODEX_ROOT}/session_index.jsonl"
assert_dir_exists "${CODEX_ROOT}/sessions"
assert_contains "${CODEX_ROOT}/session_index.jsonl" '{"thread":"shared-after-install"}'

printf '%s\n' "PASS: codex-switch-snapshot smoke test"
