# State Tracker

Generated on: 2026-03-29

## Current Status

- Milestone: Self-hosted harness rollout
- Active phase: Phase 2 - rename and adoption alignment
- Status: In progress

## Active Context

- Current focus: apply the scaffold to the ai-harness repo itself and validate the local CLI plus global `harness` skill workflow end to end.
- Current branch: `dev`
- Latest artifact reviewed: `README.md`, `docs/ai-harness-premise.md`, and the existing-mode `init-json` scaffold output.

## Recent Decisions

- Renamed the project from `scaiff` to `ai-harness` across package metadata, docs, templates, and tests.
- Renamed the global OpenCode skill to `harness` and installed it under `~/.opencode/skills/ai-harness/skills/harness/`.
- Applied the scaffold to this repository in preserve-by-default existing mode so runtime docs and planning artifacts live alongside the source code.

## Open Questions

- When should `ai-harness` be published or distributed beyond a local checkout?
- Do we want any documented migration alias for users who still reach for `scaiff`?

## Next Actions

- Keep newly created scaffold files aligned with the real project docs and architecture.
- Use `ai-harness doctor . --assistant codex` after substantial scaffold or template edits.
- When changes are ready to land, run `pnpm typecheck`, `pnpm test`, and `pnpm test:smoke:dist`.
