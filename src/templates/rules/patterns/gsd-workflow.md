## GSD Workflow Pattern

Use GSD as the planning and verification layer for non-trivial work.

- keep `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and `.planning/STATE.md` current
- use `/gsd:plan-phase`, `/gsd:execute-phase`, and `/gsd:verify-work` in sequence for phase-based work
- store research in `.planning/research/` and codebase analysis in `.planning/codebase/`
- update `.planning/STATE.md` when priorities, branches, or active workstreams change materially
- when Beads is available, start phase work from a claimed issue and carry that issue ID through the phase context
- close phase-driving Beads issues only after `/gsd:verify-work` passes
- if verification finds gaps, create follow-up Beads issues instead of marking the phase complete prematurely
- if Beads is unavailable, continue with GSD rather than blocking execution
