import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  OMO_SUPERMEMORY_DISABLED_HOOK,
  OPENCODE_SKILL_NAME,
  SUPERMEMORY_PLUGIN_NAME,
  buildOpenCodeConfigEntries,
  buildOpenCodeSkillEntries,
  buildOpenCodeWorkflowEntries,
  defaultOpenCodeConfigRoot,
  defaultOpenCodeSkillsRoot,
  openCodeDefaultsFilePath,
  openCodeRuntimeConfigFilePath,
  openCodeWorkflowInstallDir,
  openCodeSkillInstallDir,
  supermemoryConfigFilePath
} from '../core/opencode-skill.js';
import type {
  InstallSkillTemplateEntry,
  InstallSkillCommandOptions,
  InstallSkillResult
} from '../core/types.js';

async function writeInstallEntry(rootDir: string, entry: InstallSkillTemplateEntry): Promise<'written' | 'unchanged'> {
  const outputPath = path.join(rootDir, entry.path);
  const generatedContent = entry.content();

  try {
    const existingContent = await readFile(outputPath, 'utf8');
    if (existingContent === generatedContent) {
      return 'unchanged';
    }

    if (entry.merge !== undefined) {
      const mergedContent = entry.merge(existingContent, generatedContent);
      if (mergedContent === null || mergedContent === existingContent) {
        return 'unchanged';
      }

      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, mergedContent, 'utf8');
      return 'written';
    }
  } catch {
    // continue
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, generatedContent, 'utf8');
  return 'written';
}

export async function runInstallSkill(options: InstallSkillCommandOptions): Promise<InstallSkillResult> {
  if (options.assistant !== 'opencode') {
    throw new Error('Global skill installation currently supports only the opencode assistant.');
  }

  const targetRoot = path.resolve(options.cwd, options.targetRoot ?? defaultOpenCodeSkillsRoot());
  const configRoot = path.resolve(options.cwd, options.configRoot ?? defaultOpenCodeConfigRoot());
  const installDir = openCodeSkillInstallDir(targetRoot);
  const workflowDir = openCodeWorkflowInstallDir(configRoot);
  const openCodeDefaultsPath = openCodeDefaultsFilePath(configRoot);
  const openCodeRuntimeConfigPath = openCodeRuntimeConfigFilePath(configRoot);
  const supermemoryConfigPath = supermemoryConfigFilePath(configRoot);
  const resolvedWorkflowFilePath = path.join(configRoot, 'get-shit-done', 'workflows', 'autonomous.md');
  const writtenPaths: string[] = [];
  const unchangedPaths: string[] = [];
  const writtenConfigPaths: string[] = [];
  const unchangedConfigPaths: string[] = [];
  const writtenWorkflowPaths: string[] = [];
  const unchangedWorkflowPaths: string[] = [];

  await mkdir(installDir, { recursive: true });

  for (const entry of buildOpenCodeSkillEntries()) {
    const status = await writeInstallEntry(installDir, entry);
    if (status === 'written') {
      writtenPaths.push(entry.path);
      continue;
    }
    unchangedPaths.push(entry.path);
  }

  await mkdir(workflowDir, { recursive: true });

  for (const entry of buildOpenCodeConfigEntries()) {
    const status = await writeInstallEntry(configRoot, entry);
    if (status === 'written') {
      writtenConfigPaths.push(entry.path);
      continue;
    }
    unchangedConfigPaths.push(entry.path);
  }

  for (const entry of buildOpenCodeWorkflowEntries()) {
    const status = await writeInstallEntry(configRoot, entry);
    if (status === 'written') {
      writtenWorkflowPaths.push(entry.path);
      continue;
    }
    unchangedWorkflowPaths.push(entry.path);
  }

  const runtimeConfigContent = await readFile(outputOrFallback(openCodeRuntimeConfigPath), 'utf8').catch(() => null);
  const supermemorySettingsContent = await readFile(outputOrFallback(supermemoryConfigPath), 'utf8').catch(() => null);
  const openCodeDefaultsContent = await readFile(outputOrFallback(openCodeDefaultsPath), 'utf8').catch(() => null);
  const hasSupermemoryPlugin = runtimeConfigContent?.includes(SUPERMEMORY_PLUGIN_NAME) ?? false;
  const hasSupermemoryApiKey = Boolean(process.env.SUPERMEMORY_API_KEY) || (supermemorySettingsContent?.includes('"apiKey"') ?? false);
  const hasDisabledRecoveryHook = openCodeDefaultsContent?.includes(OMO_SUPERMEMORY_DISABLED_HOOK) ?? false;

  return {
    assistant: options.assistant,
    skillName: OPENCODE_SKILL_NAME,
    targetRoot,
    configRoot,
    installDir,
    workflowDir,
    workflowFilePath: resolvedWorkflowFilePath,
    openCodeDefaultsFilePath: openCodeDefaultsPath,
    openCodeRuntimeConfigFilePath: openCodeRuntimeConfigPath,
    supermemoryConfigFilePath: supermemoryConfigPath,
    writtenPaths,
    unchangedPaths,
    writtenConfigPaths,
    unchangedConfigPaths,
    writtenWorkflowPaths,
    unchangedWorkflowPaths,
    notes: [
      'Restart OpenCode after installing or updating global skills.',
      'Make sure the `ai-harness` CLI is on your PATH before invoking the installed skill.',
      'The installed skill expects `ai-harness` to be available locally on your machine, typically via a checkout plus `pnpm install:local`.',
      `The install also refreshes the managed OpenCode defaults at ${openCodeDefaultsPath}.`,
      `The install also refreshes the managed autonomous workflow at ${resolvedWorkflowFilePath}.`,
      `Optional supermemory setup: run \`bunx ${SUPERMEMORY_PLUGIN_NAME}@latest install --no-tui --disable-context-recovery\`.`,
      `Supermemory plugin registration lives in ${openCodeRuntimeConfigPath}; settings live in ${supermemoryConfigPath}.`,
      hasSupermemoryPlugin
        ? 'Supermemory plugin registration detected in the OpenCode runtime config.'
        : `Supermemory is not registered yet. Add \`${SUPERMEMORY_PLUGIN_NAME}\` to ${openCodeRuntimeConfigPath} or run the official installer.`,
      hasSupermemoryApiKey
        ? 'Supermemory API key source detected via SUPERMEMORY_API_KEY or supermemory.jsonc.'
        : 'Supermemory API key not detected. Set SUPERMEMORY_API_KEY or add an apiKey entry to supermemory.jsonc before relying on memory injection.',
      hasDisabledRecoveryHook
        ? `Oh-my-opencode compatibility hook is already disabled in ${openCodeDefaultsPath}.`
        : `If you enable supermemory with oh-my-opencode, add \`disabled_hooks: ["${OMO_SUPERMEMORY_DISABLED_HOOK}"]\` to ${openCodeDefaultsPath}.`,
      'Verify supermemory with `opencode -c` and confirm the plugin is listed in Available Tools.'
    ]
  };
}

function outputOrFallback(filePath: string): string {
  return filePath;
}

export function formatInstallSkillReport(result: InstallSkillResult): string {
  const lines = [
    `Installed ${result.skillName} (${result.assistant}) in ${result.installDir}`,
    `Skill files written: ${result.writtenPaths.length}`,
    `Skill files unchanged: ${result.unchangedPaths.length}`,
    `OpenCode config files written: ${result.writtenConfigPaths.length}`,
    `OpenCode config files unchanged: ${result.unchangedConfigPaths.length}`,
    `Workflow files written: ${result.writtenWorkflowPaths.length}`,
    `Workflow files unchanged: ${result.unchangedWorkflowPaths.length}`
  ];

  if (result.writtenPaths.length > 0) {
    lines.push('', 'Written skill files:');
    for (const entry of result.writtenPaths) {
      lines.push(`- ${entry}`);
    }
  }

  if (result.writtenConfigPaths.length > 0) {
    lines.push('', 'Written OpenCode config files:');
    for (const entry of result.writtenConfigPaths) {
      lines.push(`- ${entry}`);
    }
  }

  if (result.writtenWorkflowPaths.length > 0) {
    lines.push('', 'Written workflow files:');
    for (const entry of result.writtenWorkflowPaths) {
      lines.push(`- ${entry}`);
    }
  }

  if (result.notes.length > 0) {
    lines.push('', 'Notes:');
    for (const note of result.notes) {
      lines.push(`- ${note}`);
    }
  }

  return `${lines.join('\n')}\n`;
}
