## Deployment Pattern

Keep deployment config repo-driven and aligned with `config/*.yml`.

- treat `config/deploy.yml` as a starter manifest that still needs service-specific customization
- use `config/deploy.cognee.yml` only when the repository opts into the optional Cognee service flow
- keep `.kamal/secrets.example` placeholder-only and keep `.kamal/secrets*` out of git
- route infrastructure changes through repo edits and deploy tooling, not direct server mutation
