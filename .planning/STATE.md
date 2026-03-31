# State Tracker

Generated on: 2026-03-31

## Current Status

- Milestone: v1.0
- Active phase: None
- Status: Complete

## Active Context

- Current focus: v1.0 remains complete while the optional Cognee deploy follow-up is being hardened by pinning the image to a known-good Cognee release and aligning the single-tenant pgvector config with disabled backend access control.
- Current branch: `feat/workflow-improvements`
- Active Beads epic: None
- Latest artifact reviewed: `config/deploy.cognee.yml`

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
- `/land` is scoped to feature-branch closeout only: push the feature branch, open or update the PR to `dev`, and never touch `main`.
- This repo is adopting a Muninn-style executable BDD lane with `.feature`, `.plan.md`, and `.spec.ts` under `apps/cli/features/` plus `pnpm test:bdd`.
- `ai-harness install-skill --assistant opencode` now owns both the global `harness` skill refresh and the managed OpenCode `/gsd-autonomous` workflow refresh.
- The optional Cognee deploy template now pins `cognee/cognee:v0.5.6` instead of floating on `latest` so downstream deploys get a stable release with the Postgres migration fixes already shipped upstream.
- The optional Cognee pgvector deploy flow now sets `ENABLE_BACKEND_ACCESS_CONTROL=false` alongside `REQUIRE_AUTHENTICATION=false` so single-tenant installs do not boot into unsupported multi-user handler validation.

## Open Questions

- How much more of the local refresh flow should be automated without weakening explicit review?
- Which additional shared GSD files, if any, should be managed through the same versioned OpenCode override mechanism beyond `autonomous.md`?
- Which v2 ergonomics improvements should land first after the workflow UX pass: refresh flow, merge/update help, or richer doctor/adoption guidance?
- How should deploy-time secrets for the optional Cognee service be supplied locally so `kamal deploy -c config/deploy.cognee.yml` can be rerun without introducing any git-tracked secrets?

## Next Actions

- Provide or reload the missing local Cognee deploy secrets, then rerun `kamal deploy -c config/deploy.cognee.yml` and verify `ai-harness-cognee.apps.compute.lan` becomes healthy.
- Submit the backlog-driven `/gsd-autonomous` behavior to the shared GSD source so the managed override can become unnecessary over time.
- Start the next v2 ergonomics issue around local refresh, merge/update help, or richer doctor guidance.
