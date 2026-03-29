## Deployment Pattern

Keep deployment config repo-driven and aligned with `config/*.yml`.

- `config/deploy.yml` is a starter manifest, not a production-ready service definition for this CLI repo
- `config/deploy.cognee.yml` is the concrete optional Cognee service template
- keep `.kamal/secrets.example` placeholder-only and keep real `.kamal/secrets*` out of git
- route infra changes through repo edits and deploy tooling, not direct server mutation
