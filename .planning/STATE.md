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
- Chose a local-use distribution model: `ai-harness` is used on local developer machines and is not planned for package-manager publication.
- Generated repos now record an `ai-harness` scaffold baseline and generation date in `.planning/STATE.md`.
- Phase 3 made the local install/update path and the no-alias `scaiff` migration stance explicit.

## Open Questions

- How much more of the local refresh flow should be automated without weakening explicit review?

## Next Actions

- Improve local refresh ergonomics without weakening preserve-by-default adoption.
- Carry the Phase 3 distribution guidance into future doctor and existing-repo upgrade improvements.
