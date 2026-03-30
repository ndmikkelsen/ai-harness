# Autonomous Execution Rules

Use this workflow when one agent is driving ready backlog work end to end instead of splitting work across parallel waves.

## Beads Detection

Check for Beads once at startup and degrade gracefully when it is unavailable.

```bash
BEADS_AVAILABLE=$(test -d .beads && command -v bd >/dev/null 2>&1 && echo "true" || echo "false")
```

- if `BEADS_AVAILABLE` is `false`, continue with the GSD flow without blocking on issue tracking
- if `BEADS_AVAILABLE` is `true`, carry the active issue ID through planning, execution, verification, and handoff

## Default Loop

1. Review `.rules/patterns/operator-workflow.md`, `.planning/STATE.md`, and the active planning context.
2. If `BEADS_AVAILABLE=true`, start from `bd ready --json` and claim the active issue with `bd update <id> --claim --json`.
3. Use `/gsd-next` as the default entrypoint for the claimed work.
4. If the work routes into a phase, continue with `/gsd-discuss-phase <n>`, `/gsd-plan-phase <n>`, `/gsd-execute-phase <n>`, and `/gsd-verify-work <n>`.
5. If the work routes into quick execution, keep using the GSD quick path until verification is complete.
6. Close or update Beads issues only after verification passes.

## Phase Tracking Shape

- use one Beads epic or task for the phase-level unit of work
- create child tasks only when the plan naturally splits into meaningful tracked units
- do not create RED/GREEN/REFACTOR child issues here; leave that to more specialized BDD workflows when needed
- keep Beads dependencies aligned with phase ordering when the backlog already models blockers

## Verification Outcomes

- on pass: close the active Beads issue with a reason that references the verification artifact or phase outcome
- on retryable gaps: keep the issue open, fix the gaps, and rerun verification
- on hard blockers or human-required checks: create or update follow-up issues instead of closing the parent work early
- on skip or abort: update or close the active Beads issue with a clear reason so the backlog matches reality

## Config Policy

- do not hard-code `.beads/config.yaml` keys in this workflow unless they are validated against the installed `bd` version
- if JSONL or event export is needed for automation, verify the current Beads config surface first rather than assuming keys like `export_to_jsonl`

## Handoff

- record the active or closed Beads issue ID in handoff notes when phase work used Beads
- mention whether verification passed, failed, or produced follow-up issues
- if a repo uses `.codex/scripts/land.sh`, make sure issue state already reflects the latest verification result before landing
- landing only publishes the feature branch and manages the PR to `dev`; it never promotes into `main`
