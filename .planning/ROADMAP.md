# AI Harness Roadmap

## Phase Overview

| Phase | Goal | Requirements | Beads |
| --- | --- | --- | --- |
| 1 | Ship the preserve-by-default scaffold engine and shared Codex/OpenCode runtime | CORE-01, CORE-02, CORE-03 | Historical |
| 2 | Finish the ai-harness rename, self-host adoption, and global `harness` skill flow | CORE-04, CORE-05 | `ai-harness-3uw` |
| 3 | Harden distribution, migration, and publish readiness | CORE-06 | `ai-harness-b42` |

## Phase Notes

- Phase 1 is effectively complete and covered by the current CLI, generators, and test suite.
- Phase 2 is verified: doctrine, curated cleanup, doctor guidance, adoption fixtures, and dogfood validation all landed through `.planning/phases/phase-2-self-hosted-harness-rollout/` and Beads epic `ai-harness-3uw`.
- Phase 3 is verified: downstream repos now get scaffold baseline markers, preserve-by-default upgrade guidance, local-source install/update docs, and explicit `scaiff` migration messaging through `.planning/phases/phase-3-distribution-readiness/` and Beads epic `ai-harness-b42`.
