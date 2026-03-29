# {{COMPAT_LABEL}} Compatibility Layer

This repository already has working project systems for backlog tracking, planning, and knowledge capture.
{{COMPAT_LABEL}} should use them directly through this runtime layer.

## Canonical Systems

- .rules/ is the source of truth for architecture and workflow patterns
- .planning/ is the GSD execution and handoff workspace
- .codex/scripts/ contains the live Cognee and planning sync plumbing
- Use native `bd` as the Beads task-tracking interface after `bd init`

## {{COMPAT_LABEL}} Mapping

| Existing project surface | {{COMPAT_LABEL}} entrypoint |
| --- | --- |
| Runtime scripts | .codex/scripts/*.sh |
| Agent role briefs | .codex/agents/*.md |
| Repo setup skill | .codex/skills/harness/SKILL.md |
| Cognee advisor | ./.codex/scripts/cognee-brief.sh |
| Planning sync | ./.codex/scripts/sync-planning-to-cognee.sh |
| Landing protocol | ./.codex/scripts/land.sh |

## Runtime Surface

- `./.codex/scripts/cognee-bridge.sh` - low-level Cognee query, upload, and cognify entrypoint
- `./.codex/scripts/cognee-sync-planning.sh` - sync GSD planning artifacts into Cognee
- `./.codex/scripts/sync-planning-to-cognee.sh` - user-facing planning sync entrypoint
- `./.codex/scripts/bootstrap-worktree.sh` - seed local worktree state
- `.codex/workflows/autonomous-execution.md` - Beads-aware single-agent phase workflow with graceful degradation
- `.codex/docker/Dockerfile.cognee` - container build source for the Cognee deploy template
- `.codex/skills/harness/SKILL.md` - reusable setup workflow for new and existing repositories

## Default Workflow

1. Read relevant .rules/ and current .planning/ context.
2. Review .planning/STATE.md before starting implementation.
3. If Beads is available, start from `bd ready --json`, claim the active issue, and carry the issue ID through phase notes.
4. For existing repos, optionally run `ai-harness --mode existing <path> --cleanup-manifest legacy-ai-frameworks-v1 --init-json` before tailoring new scaffold files.
5. Generate a knowledge brief with ./.codex/scripts/cognee-brief.sh.
6. On a fresh worktree, run ./.codex/scripts/bootstrap-worktree.sh.
7. Use `.codex/workflows/autonomous-execution.md` for one-agent phase work, or `.codex/workflows/parallel-execution.md` for multi-wave execution.
8. Validate each wave before handing off or merging into the next.
9. Close or update Beads issues only after verification passes; create bug issues for verification gaps when needed.
10. Finish with ./.codex/scripts/land.sh.

## Rules

- Do not create parallel planning systems under .codex/.
- Treat .codex/ as the runtime surface for assistant-specific scripts and docs while keeping `.planning/` and `.rules/` canonical.
- If Cognee is unavailable, continue with .rules/, .planning/, and repo search.
