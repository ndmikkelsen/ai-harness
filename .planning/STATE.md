# State Tracker

Generated on: 2026-03-29

## Current Status

- Milestone: v1.0
- Active phase: None
- Status: Complete

## Active Context

- Current focus: simplify the day-to-day AI workflow so Beads -> GSD -> land is interactive-first, uses real GSD command names, and includes executable Muninn-style BDD coverage for CLI behavior.
- Current branch: `feat/ai-workflow-ux`
- Active Beads epic: `ai-harness-f8n`
- Latest artifact reviewed: `.rules/patterns/operator-workflow.md`

## Recent Decisions

- Renamed the project from `scaiff` to `ai-harness` across package metadata, docs, templates, and tests.
- Renamed the global OpenCode skill to `harness` and installed it under `~/.opencode/skills/ai-harness/skills/harness/`.
- Applied the scaffold to this repository in preserve-by-default existing mode so runtime docs and planning artifacts live alongside the source code.
- Created Beads epics/tasks for Phases 2 and 3 and aligned them to dedicated GSD phase workspaces.
- Verified the Phase 2 dogfood loop with self-hosted dry-run adoption, repo doctor, sample existing-repo adoption, full tests, and dist smoke validation.
- Chose a local-use distribution model: `ai-harness` is used on local developer machines and is not planned for package-manager publication.
- Generated repos now record an `ai-harness` scaffold baseline and generation date in `.planning/STATE.md`.
- Phase 3 made the local install/update path and the no-alias `scaiff` migration stance explicit.
- v1.0 closes with all core flows and quality gates satisfied through the Phase 1-3 delivery arc.
- The canonical operator runbook now lives in `.rules/patterns/operator-workflow.md` and uses `/gsd-next` plus `/gsd-resume-work` as the default interactive GSD entrypoints.
- `/land` is being re-scoped to feature-branch closeout only: push the feature branch, open or update the PR to `dev`, and never touch `main`.
- This repo is adopting a Muninn-style executable BDD lane with `.feature`, `.plan.md`, and `.spec.ts` under `apps/cli/features/` plus `pnpm test:bdd`.

## Open Questions

- How much of the backlog-driven `/gsd-autonomous` behavior should live in repo-scaffolded docs and runtime versus companion changes in the shared GSD layer?
- Which v2 ergonomics improvements should land first after the workflow UX pass: refresh flow, merge/update help, or richer doctor/adoption guidance?

## Next Actions

- Finish the workflow UX pass by validating docs, BDD, landing, and dist smoke behavior together.
- Decide whether to upstream companion changes to the shared `gsd-autonomous` workflow after the scaffold/runtime side is landed.
