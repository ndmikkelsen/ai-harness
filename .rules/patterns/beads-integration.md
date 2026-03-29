## Beads Integration Pattern

Use native `bd` commands for Beads.

Run `bd init` once per repository to initialize Beads using the official defaults.
Treat `.beads/` as project-local issue state by default.
Do not require a Beads Dolt remote or remote sync step for normal repository use.
Only reach for low-level `bd dolt` commands when explicitly debugging local Beads internals.
For worktrees, rely on Beads' built-in shared `.beads/` handling or `bd worktree create`; do not add custom compute/local switching in repo scripts.

## Beads -> GSD -> Beads

Use this loop for phase-based work when Beads is available:

1. `bd ready --json`
2. `bd update <id> --claim --json`
3. `/gsd:discuss-phase`
4. `/gsd:plan-phase`
5. `/gsd:execute-phase`
6. `/gsd:verify-work`
7. `bd close <id> --reason "Verified: <artifact or phase> passed"`

- reference the active Beads issue IDs in phase context notes and handoff docs
- do not close Beads issues ad hoc before verification passes
- if verification finds gaps, create follow-up Beads bug issues instead of hiding the failure
- use Beads dependencies to shape phase ordering when they exist

## Autonomous Workflow Integration

- if a repo adds an automated or autonomous GSD driver, gate all Beads operations behind a check for both `.beads/` and the `bd` executable
- when Beads is unavailable, skip tracking steps and continue the GSD flow rather than blocking execution
- if Beads is available, create or claim the phase-level issue before planning, keep child tasks tied to concrete plans, and close them only after verification passes
- validate Beads config keys against the installed `bd` version before codifying JSONL or events export behavior
