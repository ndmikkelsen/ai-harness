import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  OPENCODE_SKILL_NAME,
  OPENCODE_SKILL_REPO_NAME,
  buildOpenCodeSkillEntries,
  defaultOpenCodeSkillsRoot
} from '../../src/core/opencode-skill.js';

describe('OpenCode skill helpers', () => {
  it('uses the default OpenCode skills root in the home directory', () => {
    expect(defaultOpenCodeSkillsRoot()).toBe(path.join(os.homedir(), '.opencode', 'skills'));
  });

  it('builds the full global skill bundle', () => {
    expect(OPENCODE_SKILL_REPO_NAME).toBe('ai-harness');
    expect(OPENCODE_SKILL_NAME).toBe('harness');
    expect(buildOpenCodeSkillEntries().map((entry) => entry.path)).toEqual(
      expect.arrayContaining([
        'skills/harness/SKILL.md',
        'skills/harness/references/ai-harness-command-matrix.md',
        'skills/harness/references/existing-repo-context-checklist.md',
        'skills/harness/references/scaffold-customization-map.md',
        'skills/harness/references/manifest-discovery.md',
        'skills/harness/assets/adoption-notes-template.md'
      ])
    );
  });
});
