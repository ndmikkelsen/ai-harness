#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

if [[ -f "$repo_root/STICKYNOTE.example.md" && ! -f "$repo_root/STICKYNOTE.md" ]]; then
  cp "$repo_root/STICKYNOTE.example.md" "$repo_root/STICKYNOTE.md"
fi

cat <<EOF
Bootstrapped worktree-local AI workflow state.

- STICKYNOTE.md: seeded from STICKYNOTE.example.md when missing

Next:
1. Run `bd init` once if Beads has not been initialized in this repository yet
2. Run `bd ready --json`
3. Review `.planning/STATE.md` before implementation
EOF
