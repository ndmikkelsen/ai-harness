## BDD Workflow Pattern

Add or update behavior-first coverage when a change affects user-visible workflows.

- prefer the repository's existing `.feature` layout instead of inventing a new parallel structure
- in app-based repos, favor app-local feature directories such as `apps/<app>/features/`
- keep step definitions close to shared test infrastructure instead of ad hoc `.features/` roots
- pair feature coverage with executable regression tests where practical
