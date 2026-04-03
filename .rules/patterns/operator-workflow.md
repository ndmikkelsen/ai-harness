## Operator Workflow Pattern

Use this file as the canonical day-to-day workflow for repositories scaffolded with `ai-harness`.

The default experience is interactive-first: pick ready work in Beads, scope with repo-local plan context, verify the result, then land from your feature branch.
For OMO lane and tool ownership, treat `.rules/patterns/omo-agent-contract.md` as the normative companion to this workflow.

## Start Or Resume Work

1. In OpenCode, prefer `kdco/worktree` with the scaffolded `.opencode/worktree.jsonc`; it runs `./.codex/scripts/bootstrap-worktree.sh --quiet` after each worktree is created. If the plugin is unavailable, run `./.codex/scripts/bootstrap-worktree.sh` manually in a fresh checkout or worktree so local `STICKYNOTE.md`, shared `.env*`, and `.kamal/secrets*` links are set up when available.
2. If returning to in-flight work, review local handoff context first, especially `STICKYNOTE.md`, `.planning/STATE.md`, and claimed Beads issue history when present.
3. If the repository uses Beads, run `bd ready --json` and claim the active issue with `bd update <id> --claim --json`.
4. Capture scope and acceptance criteria in repo-local plan context before broad edits, for example in `.planning/` notes, issue evidence, or lane handoff artifacts.
5. For planning, research, or autonomous startup work, attempt `./.codex/scripts/cognee-brief.sh "<query>"` before broad exploration; if Cognee is unavailable, follow the lane fallback or blocked behavior defined in `.rules/patterns/omo-agent-contract.md`.

## Interactive-First Default

Use this loop for normal work:

1. `bd ready --json`
2. `bd update <id> --claim --json`
3. confirm or refresh repo-local plan context and acceptance criteria
4. implement, run required verification, and record evidence for handoff
5. Close the Beads issue only after verification passes: `bd close <id> --reason "Verified: <artifact or task> passed" --json`
6. If you are in an execution/autonomous landing lane, finish the branch with `./.codex/scripts/land.sh`

## Quick Work

- For a single-session change, still use Beads claim-first flow and run the smallest verification command that proves the change.
- Keep quick work in repo-local notes and handoff artifacts, skip heavyweight plan expansion unless risk or scope changes.

## BDD And TDD

- User-visible behavior starts with a `.feature` file.
- For TypeScript and Vitest repositories, prefer app-local BDD folders like `apps/<app>/features/<domain>/` with `.feature`, `.plan.md`, and `.spec.ts` together.
- Observe a real RED phase before production changes: run the failing BDD or unit test and confirm it fails for the right reason.
- GREEN means the smallest implementation that makes the scenario or test pass.
- REFACTOR keeps both the behavior lane and the regression lane green.

## Autonomous Power Mode

Use `.codex/workflows/autonomous-execution.md` when you want the system to drain ready work without prompting through each lane transition.

- start from `bd ready --json` when Beads is available
- attempt Cognee before broad planning or repository-wide exploration
- claim the next ready issue automatically
- route from planning and research into execution and review using lane-authorized handoffs
- prefer ready backlog work before roadmap-only planning artifacts; fall back to in-flight plans only when no ready issues remain
- keep retrying until code, validation, verification, and acceptance criteria pass or a true blocker stops progress
- allow one automatic gap-closure cycle after verification reports `gaps_found`, then stop and hand off if gaps remain
- close issues only after verification passes
- land from the current feature branch before moving to the next issue
- if you use OpenCode, rerun `ai-harness install-skill --assistant opencode` after harness updates to refresh the managed autonomous workflow

## Landing

`./.codex/scripts/land.sh` is a feature-branch closeout only.

- only execution or autonomous landing lanes may run it
- planning, research, and review lanes must hand off instead of publishing
- run it from a feature branch, never from `main` or `dev`
- keep issue state aligned with the latest verification evidence before landing
- it should push the current feature branch to its upstream remote
- it should ensure a pull request from the current feature branch to `dev` exists
- it must never merge, rebase onto, or push directly to `main`

## Promotion

Promotion from `dev` to `main` is a separate release step. Do not treat it as part of normal landing.

## If Beads Is Missing

- If `.beads/` or the `bd` executable is unavailable, continue with repo-local workflow guidance instead of blocking work.
- Record the missing tracker state in handoff notes so the repo can be initialized later.
- Missing Beads does not waive Cognee lane policy; follow the OMO contract separately.
