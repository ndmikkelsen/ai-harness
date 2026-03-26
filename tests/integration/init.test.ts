import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { runInit } from '../../src/commands/init.js';

describe('runInit', () => {
  it('creates the scaffold for a new project', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'scaiff-'));
    const result = await runInit({
      cwd: workspace,
      projectArg: 'sample-app',
      assistant: 'codex',
      mode: 'auto',
      dryRun: false,
      force: false,
      skipGit: true,
      detectPorts: false
    });

    expect(result.mode).toBe('new');
    expect(result.assistant).toBe('codex');
    expect(result.createdPaths).toContain('.gitignore');
    expect(result.createdPaths).toContain('.planning/config.json');
    expect(result.createdPaths).toContain('.planning/REQUIREMENTS.md');
    expect(result.createdPaths).toContain('.codex/README.md');
    expect(result.createdPaths).toContain('.codex/scripts/cognee-bridge.sh');
    expect(result.createdPaths).toContain('.codex/scripts/cognee-sync-planning.sh');
    expect(result.createdPaths).toContain('.codex/scripts/sync-planning-to-cognee.sh');
    expect(result.createdPaths).not.toContain('.codex/scripts/sync-to-cognee.sh');
    expect(result.createdPaths).not.toContain('.codex/templates/session-handoff.md');
    expect(result.createdPaths).not.toContain('.planning/TRACEABILITY.md');
    expect(result.createdPaths).not.toContain('.claude/settings.json');
    expect(result.createdPaths).not.toContain('.claude/INDEX.md');
    expect(result.createdPaths).not.toContain('CLAUDE.md');
    expect(result.createdPaths).not.toContain('CONSTITUTION.md');
    expect(result.createdPaths).not.toContain('VISION.md');
    expect(result.createdPaths).not.toContain('STICKYNOTE.md');
    expect(result.createdPaths).toContain('STICKYNOTE.example.md');
    await expect(readFile(path.join(workspace, 'sample-app', '.claude', 'INDEX.md'), 'utf8')).rejects.toThrow();
  });

  it('seeds GSD planning artifacts with official core documents', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'scaiff-'));

    await runInit({
      cwd: workspace,
      projectArg: 'planning-app',
      assistant: 'opencode',
      mode: 'auto',
      dryRun: false,
      force: false,
      skipGit: true,
      detectPorts: false
    });

    const projectDir = path.join(workspace, 'planning-app');
    const requirements = await readFile(path.join(projectDir, '.planning', 'REQUIREMENTS.md'), 'utf8');
    const roadmap = await readFile(path.join(projectDir, '.planning', 'ROADMAP.md'), 'utf8');
    const state = await readFile(path.join(projectDir, '.planning', 'STATE.md'), 'utf8');
    const phasesGuide = await readFile(path.join(projectDir, '.planning', 'phases', 'README.md'), 'utf8');
    const quickGuide = await readFile(path.join(projectDir, '.planning', 'quick', 'README.md'), 'utf8');
    const stickyExample = await readFile(path.join(projectDir, 'STICKYNOTE.example.md'), 'utf8');

    expect(requirements).toContain('# Requirements: Planning App');
    expect(requirements).toContain('## Traceability');
    expect(roadmap).toContain('## Phase Overview');
    expect(state).toContain('## Current Status');
    expect(phasesGuide).toContain('.planning/phases/<phase-slug>/');
    expect(quickGuide).toContain('.planning/quick/');
    expect(stickyExample).toContain('## Current focus');
    await expect(readFile(path.join(projectDir, '.planning', 'TRACEABILITY.md'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(projectDir, 'CLAUDE.md'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(projectDir, 'CONSTITUTION.md'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(projectDir, 'VISION.md'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(projectDir, 'STICKYNOTE.md'), 'utf8')).rejects.toThrow();
  });

  it('creates Codex compatibility files when codex is selected', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'scaiff-'));
    const result = await runInit({
      cwd: workspace,
      projectArg: 'codex-app',
      assistant: 'codex',
      mode: 'auto',
      dryRun: false,
      force: false,
      skipGit: true,
      detectPorts: false
    });

    const codexReadme = await readFile(path.join(workspace, 'codex-app', '.codex', 'README.md'), 'utf8');
    const agentsGuide = await readFile(path.join(workspace, 'codex-app', 'AGENTS.md'), 'utf8');
    const codexBridgeWrapper = await readFile(path.join(workspace, 'codex-app', '.codex', 'scripts', 'cognee-brief.sh'), 'utf8');
    const planningSyncWrapper = await readFile(path.join(workspace, 'codex-app', '.codex', 'scripts', 'sync-planning-to-cognee.sh'), 'utf8');

    expect(result.assistant).toBe('codex');
    expect(result.createdPaths).toContain('.codex/README.md');
    expect(result.createdPaths).toContain('AGENTS.md');
    expect(result.createdPaths).toContain('.codex/docker/Dockerfile.cognee');
    expect(result.createdPaths).not.toContain('.codex/scripts/sync-to-cognee.sh');
    expect(result.createdPaths).not.toContain('.codex/templates/session-handoff.md');
    expect(result.createdPaths).not.toContain('.claude/settings.json');
    expect(codexReadme).toContain('Codex Compatibility Layer');
    expect(codexReadme).toContain('./.codex/scripts/sync-planning-to-cognee.sh');
    expect(codexReadme).not.toContain('./.codex/scripts/sync-to-cognee.sh');
    expect(agentsGuide).toContain('Codex Workflow');
    expect(codexBridgeWrapper).toContain('.codex/scripts/cognee-bridge.sh');
    expect(planningSyncWrapper).toContain('.codex/scripts/cognee-sync-planning.sh');
  });

  it('creates OpenCode-compatible files on the Codex scaffold when opencode is selected', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'scaiff-'));
    const result = await runInit({
      cwd: workspace,
      projectArg: 'opencode-app',
      assistant: 'opencode',
      mode: 'auto',
      dryRun: false,
      force: false,
      skipGit: true,
      detectPorts: false
    });

    const codexReadme = await readFile(path.join(workspace, 'opencode-app', '.codex', 'README.md'), 'utf8');
    const agentsGuide = await readFile(path.join(workspace, 'opencode-app', 'AGENTS.md'), 'utf8');

    expect(result.assistant).toBe('opencode');
    expect(result.createdPaths).toContain('.codex/README.md');
    expect(result.createdPaths).toContain('AGENTS.md');
    expect(result.createdPaths).toContain('.codex/scripts/cognee-bridge.sh');
    expect(result.createdPaths).not.toContain('.codex/templates/session-handoff.md');
    expect(codexReadme).toContain('OpenCode Compatibility Layer');
    expect(agentsGuide).toContain('OpenCode Workflow');
    expect(agentsGuide).toContain('.codex/');
  });

  it('does not overwrite existing files in existing-project mode', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'scaiff-'));
    const targetDir = path.join(workspace, 'existing-project');
    const readmePath = path.join(targetDir, 'README.md');
    const gitignorePath = path.join(targetDir, '.gitignore');

    await writeFile(path.join(workspace, 'placeholder.txt'), 'placeholder', 'utf8');
    await mkdir(targetDir, { recursive: true });
    await writeFile(readmePath, '# Custom README\n', 'utf8');
    await writeFile(gitignorePath, 'dist/\n', 'utf8');

    const result = await runInit({
      cwd: workspace,
      projectArg: targetDir,
      assistant: 'codex',
      mode: 'existing',
      dryRun: false,
      force: false,
      skipGit: true,
      detectPorts: false
    });

    const readme = await readFile(readmePath, 'utf8');
    const gitignore = await readFile(gitignorePath, 'utf8');

    expect(readme).toBe('# Custom README\n');
    expect(gitignore).toContain('.env');
    expect(gitignore).toContain('.kamal/secrets');
    expect(result.skippedPaths).toContain('README.md');
    expect(result.createdPaths).toContain('.gitignore');
  });

  it('supports dry-run mode without writing files', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'scaiff-'));
    const result = await runInit({
      cwd: workspace,
      projectArg: 'dry-run-app',
      assistant: 'codex',
      mode: 'auto',
      dryRun: true,
      force: false,
      skipGit: true,
      detectPorts: false
    });

    expect(result.createdPaths.length).toBeGreaterThan(0);
    await expect(readFile(path.join(workspace, 'dry-run-app', '.gitignore'), 'utf8')).rejects.toThrow();
  });
});
