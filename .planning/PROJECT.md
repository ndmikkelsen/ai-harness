# AI Harness

## What This Is

AI Harness is a TypeScript CLI that bootstraps new and existing repositories with a Codex/OpenCode-focused runtime layer plus GSD planning artifacts, Beads guidance, and optional Cognee plumbing.

## Core Value

Give a repository a safe, repeatable AI development scaffold without clobbering existing files, while keeping one canonical workflow across local CLI use and the global `harness` skill.

## Constraints

- Technical: preserve existing files by default, keep generators modular and testable, and keep source templates aligned with built `dist/` output.
- Product: support both greenfield setup and existing-repo adoption, keep `harness` simple to invoke from OpenCode, and maintain one shared Codex/OpenCode runtime surface.
- Timeline: current work is focused on self-hosting the scaffold in this repository and hardening rename/install flows before broader distribution.

## Open Questions

- Should `ai-harness` be published as a package, or remain local-first for now?
- Do we want a temporary compatibility alias for older `scaiff` users outside this repo?
- How much of the generated runtime should stay Codex-compatible under `.codex/` versus move to more OpenCode-native surfaces later?

## Notes

- This repository is both the source of the scaffold and a live example of the scaffold applied to itself.
- Primary context lives in `README.md`, `docs/ai-harness-premise.md`, `docs/ai-harness-map.md`, and `docs/architecture.md`.
