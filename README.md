# ai-harness

`ai-harness` is the source repository for the local AI workflow bootstrapper.

This repo contains the TypeScript CLI, scaffold templates, generator code, regression tests, and the globally installed OpenCode skill named `harness`.

The CLI can:

- scaffold a brand new project directory
- adopt an existing repository without clobbering user files
- generate the local AI workflow structure for Codex/OpenCode, plus GSD, Beads, and Cognee
- keep implementation concerns separated into command, core, and generator layers

## Why this repo exists

This repository is a modular TypeScript CLI with clear module boundaries, executable regression tests, and safer defaults.

## Current command surface

`ai-harness` defaults to `--assistant codex` and also accepts `--assistant opencode` as a Codex-compatible alias.

After building, the CLI is available as `ai-harness`.

```bash
pnpm install
pnpm build

# new project
pnpm exec tsx src/cli.ts sample-app

# new project for Codex
pnpm exec tsx src/cli.ts sample-app --assistant codex

# new project for OpenCode using the same Codex-compatible scaffold
pnpm exec tsx src/cli.ts sample-app --assistant opencode

# adopt the current repository
pnpm exec tsx src/cli.ts --mode existing .

# adopt the current repository and opt into root-file merges
pnpm exec tsx src/cli.ts --mode existing . --merge-root-files

# emit machine-readable scaffold results
pnpm exec tsx src/cli.ts --mode existing . --init-json

# remove curated legacy AI-framework files before adopting
pnpm exec tsx src/cli.ts --mode existing . --cleanup-manifest legacy-ai-frameworks-v1 --init-json

# preview changes only
pnpm exec tsx src/cli.ts sample-app --dry-run

# probe the compute host for service ports before writing Kamal configs
pnpm exec tsx src/cli.ts sample-app --detect-ports

# audit an existing repository
pnpm exec tsx src/cli.ts doctor . --assistant auto

# audit with JSON output
pnpm exec tsx src/cli.ts doctor . --assistant codex --json

# install the global OpenCode skill bundle
pnpm exec tsx src/cli.ts install-skill --assistant opencode
```

## Global OpenCode skill

Install the skill bundle into OpenCode's global skills directory:

```bash
ai-harness install-skill --assistant opencode
```

That command writes the skill bundle to `~/.opencode/skills/ai-harness/skills/harness/`.

After installing or updating the skill:

- restart OpenCode so it reloads global skills
- make sure `ai-harness` is on your `PATH`
- `cd` into an existing repository and invoke the `harness` skill

## What gets scaffolded

New repositories receive the full scaffold. Existing repositories create the same missing files while preserving pre-existing scaffold files by default.

- root hygiene files like `.gitignore`, `.env.example`, `.gitleaks.toml`, `.pre-commit-config.yaml`
- Beads docs for native `bd`; run `bd init` to create `.beads/`
- `.planning/` for GSD planning artifacts
- `.codex/` runtime scripts, docs, templates, agents, and docker assets shared by Codex and OpenCode
- `.codex/skills/harness/` for reusable repository setup guidance
- `AGENTS.md` for the repo-level Codex/OpenCode operating guide
- `.kamal/` and `config/` deployment templates
- `.rules/`, `STICKYNOTE.example.md`, and `.planning/` as the canonical guidance surface

## Safety model for existing projects

- existing files are preserved by default
- missing scaffold files are added without rewriting pre-existing scaffold files
- curated legacy AI-framework cleanup is opt-in via `--cleanup-manifest legacy-ai-frameworks-v1`
- `.gitignore` and `.env.example` are only merged when `--merge-root-files` is explicitly set
- `STICKYNOTE.md` is intentionally local-only and can be seeded from `STICKYNOTE.example.md`
- `AGENTS.md` is added for Codex/OpenCode-targeted projects
- `--force` replaces managed files explicitly

## Existing repo workflow

1. gather project context from git, docs, manifests, Beads, and Cognee when available
2. optionally run `ai-harness --mode existing <path> --cleanup-manifest legacy-ai-frameworks-v1 --init-json` to remove curated legacy AI-framework files
3. run `ai-harness --mode existing <path> --init-json`
4. customize only the files listed in `createdPaths`
5. rerun with `--merge-root-files` only if you explicitly want `.gitignore` and `.env.example` merged
6. finish with `ai-harness doctor <path> --assistant <codex|opencode>`

## Beads + GSD loop

When a repository uses both Beads and GSD, the intended default loop is:

1. `bd ready --json`
2. `bd update <id> --claim --json`
3. `/gsd:discuss-phase`
4. `/gsd:plan-phase`
5. `/gsd:execute-phase`
6. `/gsd:verify-work`
7. `bd close <id> --reason "Verified"`

If verification finds gaps, create follow-up bug issues instead of closing the parent work early. If a repo has no `.beads/` folder or no `bd` binary, GSD should continue without Beads rather than blocking execution.

## Development

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm install:local
```

## Local launcher

`~/.local/bin/ai-harness` is now a thin wrapper around this repository.

- it prefers `dist/src/cli.js`
- it will try `pnpm build` if `dist/` is missing
- it falls back to the repo-installed `tsx` binary to run `src/cli.ts` when dependencies are already installed
- set `AI_HARNESS_REPO` if you want the launcher to target a different checkout

Refresh the installed launchers after moving this repo:

```bash
pnpm install:local
```

That command installs `ai-harness` into `~/.local/bin/`.

To use both the local checkout and the global OpenCode skill together:

```bash
pnpm install
pnpm build
pnpm install:local
ai-harness install-skill --assistant opencode
```

That flow gives you:

- a local `ai-harness` command on your `PATH` backed by this checkout
- a global OpenCode skill that can scaffold whichever repository you `cd` into

BDD specs live in `apps/cli/features/`, and executable regression coverage lives in `tests/`.

## Docs

- `docs/architecture.md`
- `docs/migration-plan.md`
- `docs/ai-harness-map.md`
- `docs/ai-harness-premise.md`
