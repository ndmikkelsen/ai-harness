# Scaiff Command Matrix

## Choose the mode first

- `greenfield` (`new` mode): target path does not exist or exists and is empty
- `existing`: target path already has files or is already a git repository

## Commands

### New repository

```bash
scaiff <project-slug> --assistant <codex|opencode> --init-json
```

### Existing current repository

```bash
scaiff --mode existing . --assistant <codex|opencode> --init-json
```

### Existing external path

```bash
scaiff --mode existing <path> --assistant <codex|opencode> --init-json
```

### Existing repository with root-file merges

```bash
scaiff --mode existing <path> --assistant <codex|opencode> --merge-root-files --init-json
```

## Follow-up

After any scaffold run:

```bash
scaiff doctor <target> --assistant <codex|opencode>
```

## Defaults

- prefer `codex` unless the user specifically wants `opencode`
- avoid `--force` unless the user explicitly wants managed files regenerated
- in existing repos, use `createdPaths` from the JSON output to decide what can be safely customized
