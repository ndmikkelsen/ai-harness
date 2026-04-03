import type { ManagedEntry, ScaffoldContext } from '../core/types.js';
import { buildConfigEntries } from './config.js';
import { buildCodexEntries } from './codex.js';
import { buildProjectDocEntries } from './project-docs.js';
import { buildRootEntries } from './root.js';
import { buildRuleEntries } from './rules.js';

export function buildManagedEntries(context: ScaffoldContext): ManagedEntry[] {
  return [
    ...buildRootEntries(),
    ...buildCodexEntries(),
    ...buildConfigEntries(),
    ...buildRuleEntries(),
    ...buildProjectDocEntries()
  ];
}
