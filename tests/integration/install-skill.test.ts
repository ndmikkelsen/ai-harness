import { chmod, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { runInstallSkill } from '../../src/commands/install-skill.js';
import { buildOpenCodeConfigEntries } from '../../src/core/opencode-skill.js';

describe('runInstallSkill', () => {
  it('installs the OpenCode skill bundle into the requested skills root', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'ai-harness-install-skill-'));
    const targetRoot = path.join(workspace, 'opencode-skills');
    const configRoot = path.join(workspace, 'opencode-config');

    const result = await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    expect(result.assistant).toBe('opencode');
    expect(result.skillName).toBe('harness');
    expect(result.installDir).toBe(path.join(targetRoot, 'ai-harness'));
    expect(result.workflowDir).toBe(path.join(configRoot, 'get-shit-done', 'workflows'));
    expect(result.openCodeRuntimeConfigFilePath).toBe(path.join(configRoot, 'opencode.jsonc'));
    expect(result.supermemoryConfigFilePath).toBe(path.join(configRoot, 'supermemory.jsonc'));
    expect(result.writtenPaths).toEqual(
      expect.arrayContaining([
        'skills/harness/SKILL.md',
        'skills/harness/references/ai-harness-command-matrix.md',
        'skills/harness/assets/adoption-notes-template.md'
      ])
    );
    expect(result.writtenConfigPaths).toContain('oh-my-opencode.json');
    expect(result.writtenWorkflowPaths).toContain('get-shit-done/workflows/autonomous.md');

    const installedSkill = await readFile(path.join(result.installDir, 'skills', 'harness', 'SKILL.md'), 'utf8');
    const installedCommandMatrix = await readFile(
      path.join(result.installDir, 'skills', 'harness', 'references', 'ai-harness-command-matrix.md'),
      'utf8'
    );
    const installedOpenCodeDefaults = await readFile(path.join(configRoot, 'oh-my-opencode.json'), 'utf8');
    const installedWorkflow = await readFile(path.join(result.workflowDir, 'autonomous.md'), 'utf8');
    expect(installedSkill).toContain('# Harness');
    expect(installedSkill).toContain('ai-harness --mode existing . --init-json');
    expect(installedSkill).toContain('.rules/patterns/omo-agent-contract.md');
    expect(installedSkill).toContain('~/.config/opencode/oh-my-opencode.json');
    expect(installedCommandMatrix).toContain('~/.config/opencode/oh-my-opencode.json');
    expect(installedCommandMatrix).toContain('Optional OpenCode worktree plugin');
    expect(installedOpenCodeDefaults).toContain('"sisyphus": {');
    expect(installedOpenCodeDefaults).toContain('"model": "openai/gpt-5.4"');
    expect(installedOpenCodeDefaults).toContain('"model": "openai/gpt-5.3-codex"');
    expect(installedOpenCodeDefaults).toContain('"model": "opencode/big-pickle"');
    expect(installedWorkflow).toContain('Drain ready Beads work autonomously using the repo\'s OMO contract');
    expect(installedWorkflow).toContain('.codex/workflows/autonomous-execution.md');
    expect(installedWorkflow).toContain('attempt a Cognee brief before broad planning or repo-wide exploration');
    expect(installedWorkflow).not.toContain('/gsd-');
    expect(result.notes).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Optional supermemory setup: run `bunx opencode-supermemory@latest install --no-tui --disable-context-recovery`.') ,
        expect.stringContaining('Supermemory plugin registration lives in'),
        expect.stringContaining('Supermemory is not registered yet.'),
        expect.stringContaining('Supermemory API key not detected.'),
        expect.stringContaining('disabled_hooks: ["anthropic-context-window-limit-recovery"]'),
        expect.stringContaining('Verify supermemory with `opencode -c`')
      ])
    );
  });

  it('refreshes existing managed skill and defaults files on reinstall', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'ai-harness-install-skill-'));
    const targetRoot = path.join(workspace, 'opencode-skills');
    const configRoot = path.join(workspace, 'opencode-config');
    const installDir = path.join(targetRoot, 'ai-harness');
    const skillPath = path.join(installDir, 'skills', 'harness', 'SKILL.md');
    const defaultsPath = path.join(configRoot, 'oh-my-opencode.json');
    const workflowPath = path.join(configRoot, 'get-shit-done', 'workflows', 'autonomous.md');

    await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    await writeFile(skillPath, 'stale\n', 'utf8');
    await writeFile(defaultsPath, 'stale\n', 'utf8');
    await writeFile(workflowPath, 'stale\n', 'utf8');

    const result = await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    expect(result.writtenPaths).toContain('skills/harness/SKILL.md');
    expect(result.writtenConfigPaths).toContain('oh-my-opencode.json');
    expect(result.writtenWorkflowPaths).toContain('get-shit-done/workflows/autonomous.md');
    await expect(readFile(skillPath, 'utf8')).resolves.toContain('# Harness');
    await expect(readFile(skillPath, 'utf8')).resolves.toContain('.rules/patterns/omo-agent-contract.md');
    await expect(readFile(skillPath, 'utf8')).resolves.toContain('~/.config/opencode/oh-my-opencode.json');
    await expect(readFile(defaultsPath, 'utf8')).resolves.toContain('"sisyphus": {');
    await expect(readFile(workflowPath, 'utf8')).resolves.toContain('Drain ready Beads work autonomously using the repo\'s OMO contract');
    await expect(readFile(workflowPath, 'utf8')).resolves.toContain('.codex/workflows/autonomous-execution.md');
    await expect(readFile(workflowPath, 'utf8')).resolves.not.toContain('/gsd-');
  });

  it('preserves unrelated OpenCode JSON config on rerun', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'ai-harness-install-skill-'));
    const targetRoot = path.join(workspace, 'opencode-skills');
    const configRoot = path.join(workspace, 'opencode-config');
    const defaultsPath = path.join(configRoot, 'oh-my-opencode.json');

    await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    await writeFile(
      defaultsPath,
      `${JSON.stringify(
        {
          provider: {
            custom: {
              apiBase: 'https://example.test'
            }
          },
          plugin: ['user-plugin@latest'],
          agents: {
            customAgent: {
              model: 'user/model'
            },
            sisyphus: {
              model: 'wrong/model',
              variant: 'low'
            }
          },
          categories: {
            customCategory: {
              model: 'user/category-model'
            },
            writing: {
              model: 'wrong/model',
              variant: 'low'
            }
          }
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const result = await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    expect(result.writtenConfigPaths).toContain('oh-my-opencode.json');

    const mergedOpenCodeDefaults = JSON.parse(await readFile(defaultsPath, 'utf8')) as {
      provider: { custom: { apiBase: string } };
      plugin: string[];
      agents: Record<string, { model: string; variant?: string }>;
      categories: Record<string, { model: string; variant?: string }>;
    };

    expect(mergedOpenCodeDefaults.provider.custom.apiBase).toBe('https://example.test');
    expect(mergedOpenCodeDefaults.plugin).toEqual(['user-plugin@latest']);
    expect(mergedOpenCodeDefaults.agents.customAgent).toEqual({ model: 'user/model' });
    expect(mergedOpenCodeDefaults.categories.customCategory).toEqual({ model: 'user/category-model' });
    expect(mergedOpenCodeDefaults.agents.sisyphus).toEqual({ model: 'openai/gpt-5.4', variant: 'high' });
    expect(mergedOpenCodeDefaults.categories.writing).toEqual({ model: 'openai/gpt-5.3-codex', variant: 'medium' });
  });

  it('detects supermemory plugin registration and API key guidance from existing config', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'ai-harness-install-skill-'));
    const targetRoot = path.join(workspace, 'opencode-skills');
    const configRoot = path.join(workspace, 'opencode-config');
    const runtimeConfigPath = path.join(configRoot, 'opencode.jsonc');
    const defaultsPath = path.join(configRoot, 'oh-my-opencode.json');
    const supermemorySettingsPath = path.join(configRoot, 'supermemory.jsonc');

    await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    await writeFile(runtimeConfigPath, '{"plugin":["opencode-supermemory"]}\n', 'utf8');
    await writeFile(defaultsPath, '{"disabled_hooks":["anthropic-context-window-limit-recovery"]}\n', 'utf8');
    await writeFile(supermemorySettingsPath, '{"apiKey":"sm_test"}\n', 'utf8');

    const result = await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    expect(result.notes).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Supermemory plugin registration detected'),
        expect.stringContaining('Supermemory API key source detected'),
        expect.stringContaining('compatibility hook is already disabled')
      ])
    );
  });

  it('replaces malformed managed OpenCode defaults files with generated content', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'ai-harness-install-skill-'));
    const targetRoot = path.join(workspace, 'opencode-skills');
    const configRoot = path.join(workspace, 'opencode-config');
    const defaultsPath = path.join(configRoot, 'oh-my-opencode.json');
    const generatedOpenCodeDefaults = buildOpenCodeConfigEntries()[0]?.content();

    expect(generatedOpenCodeDefaults).toBeDefined();

    await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    await writeFile(defaultsPath, '{"provider": {\n', 'utf8');

    const result = await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    expect(result.writtenConfigPaths).toContain('oh-my-opencode.json');
    await expect(readFile(defaultsPath, 'utf8')).resolves.toBe(generatedOpenCodeDefaults);
  });

  it('surfaces permission-denied errors when refreshing managed defaults files', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'ai-harness-install-skill-'));
    const targetRoot = path.join(workspace, 'opencode-skills');
    const configRoot = path.join(workspace, 'opencode-config');
    const defaultsPath = path.join(configRoot, 'oh-my-opencode.json');

    await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot,
      configRoot
    });

    await writeFile(defaultsPath, '{"stale": true}\n', 'utf8');
    await chmod(defaultsPath, 0o400);

    await expect(
      runInstallSkill({
        cwd: workspace,
        assistant: 'opencode',
        targetRoot,
        configRoot
      })
    ).rejects.toMatchObject({
      code: 'EACCES',
      path: defaultsPath,
      message: expect.stringContaining('permission denied')
    });
  });
});
