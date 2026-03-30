import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { runInstallSkill } from '../../src/commands/install-skill.js';

describe('runInstallSkill', () => {
  it('installs the OpenCode skill bundle into the requested skills root', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'ai-harness-install-skill-'));
    const targetRoot = path.join(workspace, 'opencode-skills');

    const result = await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot
    });

    expect(result.assistant).toBe('opencode');
    expect(result.skillName).toBe('harness');
    expect(result.installDir).toBe(path.join(targetRoot, 'ai-harness'));
    expect(result.writtenPaths).toEqual(
      expect.arrayContaining([
        'skills/harness/SKILL.md',
        'skills/harness/references/ai-harness-command-matrix.md',
        'skills/harness/assets/adoption-notes-template.md'
      ])
    );

    const installedSkill = await readFile(path.join(result.installDir, 'skills', 'harness', 'SKILL.md'), 'utf8');
    expect(installedSkill).toContain('# Harness');
    expect(installedSkill).toContain('ai-harness --mode existing . --init-json');
  });

  it('refreshes existing managed skill files on reinstall', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'ai-harness-install-skill-'));
    const targetRoot = path.join(workspace, 'opencode-skills');
    const installDir = path.join(targetRoot, 'ai-harness');
    const skillPath = path.join(installDir, 'skills', 'harness', 'SKILL.md');

    await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot
    });

    await writeFile(skillPath, 'stale\n', 'utf8');

    const result = await runInstallSkill({
      cwd: workspace,
      assistant: 'opencode',
      targetRoot
    });

    expect(result.writtenPaths).toContain('skills/harness/SKILL.md');
    await expect(readFile(skillPath, 'utf8')).resolves.toContain('# Harness');
  });
});
