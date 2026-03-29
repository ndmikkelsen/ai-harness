# Migration Notes

## Completed changes

- renamed the project from `scaiff` to `ai-harness`
- renamed the global OpenCode skill from `scaiff-repo-setup` to `harness`
- updated package metadata, CLI help, launcher naming, templates, docs, and tests to match the new names
- added a dedicated `install-skill` command and global skill bundle installer
- applied the scaffold back onto this repository in preserve-by-default existing mode

## Behavior that stayed stable

- new-project scaffolding and existing-repo adoption share the same generator pipeline
- existing repositories preserve pre-existing managed files by default
- curated cleanup remains opt-in via `--cleanup-manifest legacy-ai-frameworks-v1`
- Codex and OpenCode continue to share one `.codex/` runtime surface
- local verification still centers on `pnpm typecheck`, `pnpm test`, and `pnpm test:smoke:dist`

## Current migration follow-up

- decide whether to publish `ai-harness` beyond local checkout installs
- document any compatibility story for older `scaiff` users, if needed
- keep source templates, self-scaffolded repo files, and built `dist/` assets aligned as the product evolves
