#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
beads_available=false

if [[ -d "$repo_root/.beads" ]] && command -v bd >/dev/null 2>&1; then
  beads_available=true
fi

if [[ -f "$repo_root/STICKYNOTE.example.md" && ! -f "$repo_root/STICKYNOTE.md" ]]; then
  cp "$repo_root/STICKYNOTE.example.md" "$repo_root/STICKYNOTE.md"
fi

if [[ "$beads_available" == true ]]; then
  beads_status="tracking enabled"
else
  beads_status="not initialized"
fi

cat <<EOF
Bootstrapped worktree-local AI workflow state.

- STICKYNOTE.md: seeded from STICKYNOTE.example.md when missing
- Beads: $beads_status

Next:
1. Run `bd init` once if Beads has not been initialized in this repository yet
2. If you are resuming in-flight work, run `/gsd-resume-work`
3. If Beads is available, run `bd ready --json`, claim the active issue, and continue with `/gsd-next`
4. Review `.planning/STATE.md` before implementation
EOF
