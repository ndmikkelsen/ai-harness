# State Tracker

Generated on: 2026-03-29

## Current Status

- Milestone: Distribution and migration readiness
- Active phase: Phase 3 - distribution readiness
- Status: Complete

## Active Context

- Current focus: Phase 3 closeout is complete; downstream repos now have explicit baseline, upgrade, and compatibility guidance.
- Current branch: `feat/improvements`
- Active Beads epic: `ai-harness-b42`
- Latest artifact reviewed: `.planning/phases/phase-3-distribution-readiness/SUMMARY.md`

## Recent Decisions

- Renamed the project from `scaiff` to `ai-harness` across package metadata, docs, templates, and tests.
- Renamed the global OpenCode skill to `harness` and installed it under `~/.opencode/skills/ai-harness/skills/harness/`.
- Applied the scaffold to this repository in preserve-by-default existing mode so runtime docs and planning artifacts live alongside the source code.
- Created Beads epics/tasks for Phases 2 and 3 and aligned them to dedicated GSD phase workspaces.
- Verified the Phase 2 dogfood loop with self-hosted dry-run adoption, repo doctor, sample existing-repo adoption, full tests, and dist smoke validation.
- Chose a staged hybrid distribution model: support local-source installation now and defer package-manager publication until Phase 3 upgrade and migration guidance is explicit.
- Generated repos now record an `ai-harness` scaffold baseline and generation date in `.planning/STATE.md`.
- Phase 3 made the local-source install/update path and the no-alias `scaiff` migration stance explicit.

## Open Questions

- When should `ai-harness` be published or distributed beyond a local checkout?

## Next Actions

- Decide whether package-manager publication is worth supporting after the local-source path has been documented and validated.
- Carry the Phase 3 distribution guidance into any future publication or upgrade-automation work.
