import type { AssistantTarget } from './types.js';

export function assistantDisplayName(value: AssistantTarget): string {
  if (value === 'opencode') return 'OpenCode';
  return 'Codex';
}

export function codexCompatibilityLabel(value: AssistantTarget): string {
  return value === 'opencode' ? 'OpenCode' : 'Codex';
}
