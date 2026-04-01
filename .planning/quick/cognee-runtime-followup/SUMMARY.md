# Cognee Runtime Follow-Up Summary

## What We Verified

- The previous `cognee/cognee:v0.5.6` pin is not published to Docker Hub, so deploys failed before boot until the image was switched to the published `latest` digest.
- `kamal-proxy` was probing `/up` by default; adding `proxy.healthcheck.path: /health` allows the Cognee container to boot successfully.
- Matching the stronger `flashloaner`/`btc-algo-trading` pattern, the deploy now also sets `response_timeout: 300` so long-running LLM-backed requests return Cognee errors instead of proxy `504`s.
- The live service is now healthy at `https://ai-harness-cognee.apps.compute.lan/health`.
- Cognee settings now report the explicit `gpt-4o-mini` model instead of the default `openai/gpt-5-mini` selection.
- The deploy now also forces `VECTOR_DATASET_DATABASE_HANDLER=pgvector`, aligning the dataset handler with the configured vector database provider.

## Remaining Blocker

- Upload/cognify/query are still not verified end-to-end.
- With the hardened proxy settings, `/api/v1/add` and `/api/v1/cognify` now return explicit `409` failures with `LLM connection test timed out after 30s`, which is better than the earlier proxy `504` behavior but still blocks ingestion.
- `/api/v1/search` now returns an explicit `409` payload containing the underlying OpenAI `RateLimitError`, confirming the current key is still not query-ready.
- The shared `compute-stack` Cognee deployment reproduces the same external `504` search behavior, so this is likely a shared operator/provider readiness problem rather than a one-off Kamal shape bug.
- Direct authenticated `gpt-4o-mini` chat completions from inside the running container still return HTTP `429`, which matches the exposed Cognee-side rate-limit failures.

## Next Work

- `ai-harness-3rj` - restore queryability with funded LLM access
- `ai-harness-9nr` - document the preflight and post-deploy verification flow
