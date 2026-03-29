# AI Harness Command Matrix

## Choose the mode first

- `greenfield` (`new` mode): target path does not exist or exists and is empty
- `existing`: target path already has files or is already a git repository

## Commands

### New repository

```bash
ai-harness <project-slug> --assistant <codex|opencode> --init-json
```

### Existing current repository

```bash
ai-harness --mode existing . --assistant <codex|opencode> --init-json
```

### Existing external path

```bash
ai-harness --mode existing <path> --assistant <codex|opencode> --init-json
```

### Existing repository with root-file merges

```bash
ai-harness --mode existing <path> --assistant <codex|opencode> --merge-root-files --init-json
```

### Existing repository with curated legacy cleanup

```bash
ai-harness --mode existing <path> --assistant <codex|opencode> --cleanup-manifest legacy-ai-frameworks-v1 --init-json
```

### Existing repository automation with cleanup and no prompts

```bash
ai-harness --mode existing <path> --assistant <codex|opencode> --cleanup-manifest legacy-ai-frameworks-v1 --non-interactive --init-json
```

## Follow-up

After any scaffold run:

```bash
ai-harness doctor <target> --assistant <codex|opencode>
```

## Defaults

- prefer `codex` unless the user specifically wants `opencode`
- avoid `--force` unless the user explicitly wants managed files regenerated
- use `--cleanup-manifest legacy-ai-frameworks-v1` only when the user explicitly wants curated legacy AI-framework files removed
- use `--non-interactive` in automation so prompt-required cleanup entries are reported instead of guessed
- in existing repos, use `createdPaths` from the JSON output to decide what can be safely customized
