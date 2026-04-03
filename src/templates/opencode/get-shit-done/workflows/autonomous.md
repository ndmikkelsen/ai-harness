<purpose>

Drain ready Beads work autonomously using the repo's OMO contract, local workflow docs, and verification commands.

Default behavior is backlog-driven:
- claim ready Beads work first when Beads is available
- attempt a Cognee brief before broad planning or repo-wide exploration
- execute the claimed work directly from repo-local instructions instead of legacy phase-router conventions
- keep going until code, validation, verification, and acceptance criteria pass
- close work only after verification passes
- land the current feature branch before moving to the next work item

Stop only for:
- true hard blockers
- human-only verification or acceptance
- missing secrets, external accounts, or other non-inferable inputs

</purpose>

<required_reading>

Always read `.rules/patterns/operator-workflow.md`, `.rules/patterns/omo-agent-contract.md`, and `.codex/workflows/autonomous-execution.md` before acting.
Treat those repo files as the source of truth for backlog priority, verification outcomes, issue closure, landing, and blocker handling.

If the invoking prompt references a repo plan, read it in full before starting. Prefer `.sisyphus/plans/*.md`, then repo-local handoff or runbook files.

</required_reading>

<process>

<step name="initialize" priority="first">

## 1. Initialize

Detect Beads availability:

```bash
BEADS_AVAILABLE=$(test -d .beads && command -v bd >/dev/null 2>&1 && echo "true" || echo "false")
READY_JSON="[]"
if [[ "$BEADS_AVAILABLE" == "true" ]]; then
  READY_JSON=$(bd ready --json 2>/dev/null || echo "[]")
fi
```

Attempt a Cognee brief before broad planning:

```bash
COGNEE_AVAILABLE=$(./.codex/scripts/cognee-bridge.sh health >/dev/null 2>&1 && echo "true" || echo "false")
if [[ "$COGNEE_AVAILABLE" == "true" ]]; then
  COGNEE_BRIEF=$(./.codex/scripts/cognee-brief.sh "ready work, active repo state, and current branch goals" 2>/dev/null || true)
else
  COGNEE_BRIEF=""
fi
```

Display startup banner:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 OMO AUTONOMOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 Mode: backlog-driven autonomous execution
```

The managed OpenCode workflow is the entrypoint only. Shared autonomous policy lives in `.rules/patterns/operator-workflow.md`, `.rules/patterns/omo-agent-contract.md`, and `.codex/workflows/autonomous-execution.md`.

</step>

<step name="discover_work">

## 2. Discover Work

Build the work queue in this order:

1. ready Beads issues, when Beads is available
2. active repo plan or handoff artifact, when the invoking prompt or repo state points to one
3. local workflow docs and verification artifacts needed to complete the current branch safely

If no ready issues or actionable repo-local work remain:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 OMO AUTONOMOUS ▸ COMPLETE 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 No ready Beads work or actionable repo-local work remain.
```

Exit cleanly.

</step>

<step name="work_loop">

## 3. Work Loop

Repeat until there is no ready Beads work and no actionable repo-local work left.

### 3a. Pick Work

- If `BEADS_AVAILABLE=true` and `READY_JSON` contains issues, pick the first ready issue.
- Claim it immediately:

```bash
bd update <id> --claim --json
```

- Carry the issue ID through execution, verification, and handoff.
- If `COGNEE_AVAILABLE=false`, continue only when the task remains locally verifiable from `.rules/`, repo docs, tests, and current file state; otherwise stop via `handle_blocker`.

### 3b. Build Local Context

For the claimed issue or active branch goal, read the repo-local instructions that define success.

Priority order:

1. referenced `.sisyphus/plans/*.md` plan, if one exists
2. `.codex/workflows/autonomous-execution.md`
3. `.rules/patterns/operator-workflow.md`
4. relevant implementation files and tests

Do not invent a parallel planning system when the repo already provides a scoped plan or handoff.

### 3c. Execute Work

Implement the scoped change directly from the repo-local instructions.

- keep edits within the claimed work item or explicit branch goal
- prefer small, verifiable increments
- run the closest relevant tests before broadening scope
- if the task exposes user-visible or tool-visible behavior, run the behavior directly instead of relying only on static checks

### 3d. Verify

For every completed work item:

1. run the relevant targeted tests
2. run typecheck/build/doctor checks when the change affects shared runtime or scaffold behavior
3. capture or update the evidence artifact if the repo expects one

If verification reports gaps, fix them once and re-run verification.
If verification still fails, stop via `handle_blocker` instead of guessing success.

### 3e. Close Or Continue

When verification passes:

- close the active Beads issue with a reason that references the verification artifact
- if more ready work remains, continue to the next item
- if the branch is complete and you are in an authorized execution/autonomous landing lane, run the landing flow

Never close work, defer gaps silently, or continue past manual validation as if the work passed.

</step>

<step name="landing">

## 4. Landing

When the current branch goal is complete and verification is green:

```bash
./.codex/scripts/land.sh
```

Landing is execution-lane only.
Do not push or publish from planning, research, or review-only work.

</step>

<step name="handle_blocker">

## 5. Handle Blockers

Stop and hand off when:

- required secrets, accounts, or external systems are unavailable
- verification requires a human to approve or validate a real-world outcome
- repo-local instructions conflict and no canonical source resolves the conflict
- Beads or Cognee is required by repo policy and the fallback path is not locally verifiable

The handoff must include:

- what work was attempted
- what passed
- what failed or remains blocked
- the exact file paths, commands, and evidence needed for the next step

</step>

</process>
