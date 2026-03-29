## BDD Workflow Pattern

Add or update behavior-first coverage when a change affects user-visible workflows.

- this repo keeps BDD specs under `apps/cli/features/`
- keep feature coverage aligned with executable regression tests in `tests/`
- prefer updating existing feature structure over creating parallel roots
- use RED-GREEN-REFACTOR for behavior changes
