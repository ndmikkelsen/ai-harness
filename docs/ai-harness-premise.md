# AI Harness Premise

## What this project is

`ai-harness` is a modular TypeScript CLI for bootstrapping an AI-assisted repository workflow.

It supports:
- new project scaffolding
- existing repository adoption
- Beads task tracking
- Cognee integration hooks
- Codex/OpenCode runtime support through `.codex/`

## Core design

The scaffold keeps one canonical project workflow and layers assistant-specific entrypoints on top of it.

Canonical systems:
- `.rules/` for workflow and architecture guidance
- `.codex/` for Codex/OpenCode runtime scripts, guidance, and adapters
- native `bd` for Beads task tracking after `bd init`
- repo-local plan or handoff docs when a repository already keeps them

## Product intent

The tool should let a user or assistant scaffold a repository quickly, safely, and consistently, whether they are starting from scratch or adopting an existing codebase.

The most important product promises are:

- preserve existing files by default during adoption
- keep one shared Codex/OpenCode runtime surface under `.codex/`
- make the workflow usable both from the local CLI and from the global OpenCode `harness` skill
- keep the scaffold source, generated docs, and shipped `dist/` output aligned

## Product doctrine

The harness is intentionally opinionated.

- foundation installed by default: Beads, Codex/OpenCode runtime docs, and Cognee hooks governed by lane-aware attempt/fallback policy
- source of truth: `src/templates/**` for scaffold content, `src/generators/**` for mapping that content into repo outputs, and `dist/` as the built copy
- preserve by default: existing repositories keep user-owned files unless the user explicitly opts into force or a narrow merge path
- cleanup by curation only: known non-harness AI workflow droppings are removed only through explicit manifests, never broad heuristic deletion
- dogfood as product discipline: this repository is expected to use the same scaffold it ships, so local docs and runtime files should reflect the real harness contract

## Adoption contract

When `ai-harness` adopts an existing repository it should be clear what happens:

- installs: the missing harness foundation files, including root hygiene, `.rules/`, `.codex/`, deployment starters, and `STICKYNOTE.example.md`
- preserves: existing user-owned docs, prompts, scripts, and workflow files that are not explicitly managed or explicitly selected for safe merge
- removes: only known conflicting AI workflow artifacts covered by a curated cleanup manifest and only when the cleanup option is requested
- reports: created, skipped, merged, removed, and prompt-required cleanup actions through the scaffold result surface

## System decisions

| Component | Decision | Notes |
| --- | --- | --- |
| Beads integration | Keep native `bd` only | Remove the legacy wrapper, remove unused Beads templates, keep docs aligned with upstream Beads |
| Repo-local planning artifacts | Do not scaffold by default | Preserve or reference existing repo-local plans when a repository already uses them; do not install a default `.planning/` tree |
| Cognee integration | Keep planning-focused core | Keep bridge, brief, planning sync, and deploy pieces; remove the broad repo sync helper |
| OpenCode overlay | Keep lean runtime docs | Keep `AGENTS.md`, `.codex/README.md`, `.codex/agents/*`, `.codex/workflows/parallel-execution.md`, and `.codex/templates/phase-execution.md`; remove dead template files |
| Codex/OpenCode runtime | Keep `.codex/` only | Use `.codex/` as the only assistant runtime surface |
| Deploy templates | Keep with infra assumptions | Keep `.kamal/secrets.example`, `config/deploy.yml`, and `config/deploy.cognee.yml`; treat `deploy.yml` as a starter and `deploy.cognee.yml` as the concrete service template |
| Governance docs | Keep lean docs only | Remove root governance placeholders, keep `STICKYNOTE.example.md`, and use `AGENTS.md` + `.rules/` + `.codex/` as the main guidance surface |

## Operating model

- `src/templates/**` is the source of truth for generated scaffold content
- `src/generators/**` maps those templates into concrete repository outputs
- `dist/` must stay in sync with source after scaffold or runtime changes
- this repository dogfoods the scaffold so repo-level docs and runtime artifacts should reflect the real product, not placeholder starter text

## Beads decision

Approved direction:
- use upstream default Beads install mode
- run `bd init` inside each project repo
- use native `bd` commands directly
- do not maintain a repo-local wrapper that only proxies to `bd`

## Planning surface decision

Approved direction:
- do not scaffold a default `.planning/` tree
- keep repo-local planning docs optional and repository-owned
- rely on Beads, `.rules/`, `.codex/`, and existing repo docs for the default harness workflow
- only reference or sync repo-local planning artifacts when a repository already keeps them

## Governance docs decision

Approved direction:
- keep root governance lean and avoid extra placeholder policy documents
- keep `STICKYNOTE.example.md` as the reusable local handoff template
- do not scaffold `STICKYNOTE.md`; let worktree bootstrap or landing flows create it locally
- treat `AGENTS.md`, `.codex/README.md`, `.rules/`, and `.codex/workflows/` as the active documentation surface for this harness

## Runtime decision

Approved direction:
- remove the legacy assistant-specific backend directories and keep one `.codex/` runtime surface
- migrate shared backend scripts, bootstrap helpers, and Cognee assets into `.codex/`
- use one Codex/OpenCode-friendly runtime surface for both supported assistants
- keep deploy templates pointed at `.codex/docker/Dockerfile.cognee`

## Cleanup decision

Approved direction:
- support opt-in cleanup through curated manifests during existing-repo adoption, starting with `legacy-ai-frameworks-v1`
- never infer deletions heuristically; only exact curated manifest entries are eligible
- require confirmation for prompt-before-delete entries and report `prompt-required` in non-interactive runs
- report cleanup actions alongside scaffold creation through `--init-json`

## Cognee decision

Approved direction:
- keep `.codex/scripts/cognee-bridge.sh`, `.codex/scripts/cognee-brief.sh`, `.codex/scripts/cognee-sync-planning.sh`, and `.codex/scripts/sync-planning-to-cognee.sh`
- keep `.codex/docker/Dockerfile.cognee` and `config/deploy.cognee.yml`
- remove `.codex/scripts/sync-to-cognee.sh`
- keep Cognee focused on high-signal planning and execution context, with lane-aware attempt/fallback behavior instead of broad repository sync
- keep the `.rules/patterns/` Cognee compatibility guidance aligned with the OMO contract and repo-local fallback model

## Deploy template decision

Approved direction:
- keep `.kamal/secrets.example`, `config/deploy.yml`, and `config/deploy.cognee.yml`
- keep the current compute-server assumptions from policy defaults: `10.10.20.138`, `harbor.compute.lan`, and `~/.ssh/z3r0Layer-main`
- treat `config/deploy.yml` as a starter template that still needs app-specific service details
- treat `config/deploy.cognee.yml` as the concrete Cognee deployment template backed by `.codex/docker/Dockerfile.cognee`
- keep secrets placeholder-only and continue ignoring `.kamal/secrets*` in git

## Current product questions

- how much of the local refresh flow should become more automated over time?
- how much additional upgrade or merge behavior should existing-repo adoption support without sacrificing safety?
