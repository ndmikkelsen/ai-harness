import type { ManagedEntry } from '../core/types.js';
import { loadTemplate } from '../core/template-loader.js';

export function buildProjectDocEntries(): ManagedEntry[] {
  return [
    {
      kind: 'file',
      path: 'STICKYNOTE.example.md',
      content: (context) => loadTemplate('project-docs/STICKYNOTE.md', { APP_TITLE: context.appTitle })
    }
  ];
}
