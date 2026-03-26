import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

const execFile = promisify(execFileCallback);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const tsxCli = path.join(repoRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');

describe('CLI init', () => {
  it('preserves existing scaffold files by default in existing mode', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'scaiff-cli-init-'));
    const targetDir = path.join(workspace, 'existing-preserve');
    const gitignorePath = path.join(targetDir, '.gitignore');
    const envExamplePath = path.join(targetDir, '.env.example');

    await mkdir(targetDir, { recursive: true });
    await writeFile(gitignorePath, 'dist/\n', 'utf8');
    await writeFile(envExamplePath, 'EXISTING_ONLY=true\n', 'utf8');

    const result = await execFile(
      process.execPath,
      [tsxCli, 'src/cli.ts', '--mode', 'existing', '--assistant', 'codex', '--init-json', targetDir],
      {
        cwd: repoRoot,
        encoding: 'utf8'
      }
    );

    const payload = JSON.parse(result.stdout) as { createdPaths: string[]; skippedPaths: string[] };

    expect(payload.createdPaths).not.toContain('.gitignore');
    expect(payload.createdPaths).not.toContain('.env.example');
    expect(payload.skippedPaths).toContain('.gitignore');
    expect(payload.skippedPaths).toContain('.env.example');
    expect(await readFile(gitignorePath, 'utf8')).toBe('dist/\n');
    expect(await readFile(envExamplePath, 'utf8')).toBe('EXISTING_ONLY=true\n');
  });

  it('merges root files only when merge-root-files is set', async () => {
    const workspace = await mkdtemp(path.join(os.tmpdir(), 'scaiff-cli-init-'));
    const targetDir = path.join(workspace, 'existing-merge');
    const gitignorePath = path.join(targetDir, '.gitignore');
    const envExamplePath = path.join(targetDir, '.env.example');

    await mkdir(targetDir, { recursive: true });
    await writeFile(gitignorePath, 'dist/\n', 'utf8');
    await writeFile(envExamplePath, 'EXISTING_ONLY=true\n', 'utf8');

    const result = await execFile(
      process.execPath,
      [tsxCli, 'src/cli.ts', '--mode', 'existing', '--assistant', 'codex', '--merge-root-files', '--init-json', targetDir],
      {
        cwd: repoRoot,
        encoding: 'utf8'
      }
    );

    const payload = JSON.parse(result.stdout) as { createdPaths: string[] };
    const gitignore = await readFile(gitignorePath, 'utf8');
    const envExample = await readFile(envExamplePath, 'utf8');

    expect(payload.createdPaths).toContain('.gitignore');
    expect(payload.createdPaths).toContain('.env.example');
    expect(gitignore).toContain('.kamal/secrets');
    expect(envExample).toContain('# AI workflow scaffold');
    expect(envExample).toContain('LLM_API_KEY=YOUR_OPENAI_API_KEY_HERE');
  });
});
