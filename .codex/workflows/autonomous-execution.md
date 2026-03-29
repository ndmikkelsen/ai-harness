# Autonomous Execution Rules

Use this workflow when one agent is driving a phase end to end instead of splitting work across parallel waves.

## Beads Detection

Check for Beads once at startup and degrade gracefully when it is unavailable.

```bash
BEADS_AVAILABLE=$(test -d .beads && command -v bd >/dev/null 2>&1 && echo "true" || echo "false")
```

- if `BEADS_AVAILABLE` is `false`, continue with the GSD flow without blocking on issue tracking
- if `BEADS_AVAILABLE` is `true`, carry the active issue ID through planning, execution, verification, and handoff

## Default Loop

1. Review `.planning/STATE.md`, the active phase docs, and relevant `.rules/` guidance.
2. If `BEADS_AVAILABLE=true`, start from `bd ready --json` and claim the active issue with `bd update <id> --claim --json`.
3. Run `/gsd:discuss-phase` when the phase still needs framing or open assumptions resolved.
4. Run `/gsd:plan-phase` and keep the active Beads issue ID in the phase context.
5. Execute the plan with `/gsd:execute-phase`.
6. Validate the result with `/gsd:verify-work`.
7. Close or update Beads issues only after verification passes.

## Phase Tracking Shape

- use one Beads epic or task for the phase-level unit of work
- create child tasks only when the plan naturally splits into meaningful tracked units
- do not create RED/GREEN/REFACTOR child issues here; leave that to more specialized BDD workflows when needed
- keep Beads dependencies aligned with phase ordering when the backlog already models blockers

## Verification Outcomes

- on pass: close the active Beads issue with a reason that references the verification artifact or phase outcome
- on gaps found: create follow-up Beads bug or task issues instead of closing the parent work early
- on skip or abort: update or close the active Beads issue with a clear reason so the backlog matches reality

## Config Policy

- do not hard-code `.beads/config.yaml` keys in this workflow unless they are validated against the installed `bd` version
- if JSONL or event export is needed for automation, verify the current Beads config surface first rather than assuming keys like `export_to_jsonl`

## Handoff

- record the active or closed Beads issue ID in handoff notes when phase work used Beads
- mention whether verification passed, failed, or produced follow-up issues
- if a repo uses `.codex/scripts/land.sh`, make sure issue state already reflects the `/gsd:verify-work` result before landing
