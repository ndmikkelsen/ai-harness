## Cognee GSD Integration

Use Cognee as an optional knowledge accelerator for GSD planning and execution.

## Primary Entry Points

- `./.codex/scripts/cognee-brief.sh "<query>"` for a quick knowledge brief before planning or implementation
- `./.codex/scripts/sync-planning-to-cognee.sh` to upload `.planning/` artifacts into the planning dataset
- `./.codex/scripts/cognee-bridge.sh health` to check availability without blocking work

## What To Sync

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- active phase artifacts like `CONTEXT.md`, `RESEARCH.md`, `PLAN.md`, `SUMMARY.md`, `VERIFICATION.md`, and `UAT.md`

## Guardrails

- Cognee is non-blocking; continue with `.rules/`, `.planning/`, and repo search if it is unavailable
- Do not create a second planning system or store canonical decisions only in Cognee
- Prefer planning sync over broad repository sync so uploaded knowledge stays high signal
