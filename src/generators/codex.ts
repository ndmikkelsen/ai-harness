import { codexCompatibilityLabel } from '../core/assistant.js';
import type { ManagedEntry } from '../core/types.js';
import { loadTemplate } from '../core/template-loader.js';

function codexReadme(assistantLabel: string): string {
  return loadTemplate('codex/README.md', { COMPAT_LABEL: assistantLabel });
}

function parallelExecutionWorkflow(): string {
  return loadTemplate('codex/workflows/parallel-execution.md');
}

function orchestrator(): string {
  return loadTemplate('codex/agents/orchestrator.md');
}

function implementer(): string {
  return loadTemplate('codex/agents/implementer.md');
}

function reviewer(): string {
  return loadTemplate('codex/agents/reviewer.md');
}

function gsdCogneeAdvisor(): string {
  return loadTemplate('codex/agents/gsd-cognee-advisor.md');
}

function scaiffRepoSetupSkill(): string {
  return loadTemplate('codex/skills/scaiff-repo-setup/SKILL.md');
}

function scaiffCommandMatrix(): string {
  return loadTemplate('codex/skills/scaiff-repo-setup/references/scaiff-command-matrix.md');
}

function existingRepoContextChecklist(): string {
  return loadTemplate('codex/skills/scaiff-repo-setup/references/existing-repo-context-checklist.md');
}

function scaffoldCustomizationMap(): string {
  return loadTemplate('codex/skills/scaiff-repo-setup/references/scaffold-customization-map.md');
}

function manifestDiscoveryGuide(): string {
  return loadTemplate('codex/skills/scaiff-repo-setup/references/manifest-discovery.md');
}

function adoptionNotesTemplate(): string {
  return loadTemplate('codex/skills/scaiff-repo-setup/assets/adoption-notes-template.md');
}

function phaseExecutionTemplate(): string {
  return loadTemplate('codex/templates/phase-execution.md');
}

function codexTemplate(contextAppSlug: string, templatePath: string): string {
  return loadTemplate(templatePath, { APP_SLUG: contextAppSlug });
}

function agentsGuide(assistantLabel: string): string {
  return loadTemplate('codex/AGENTS.md', { COMPAT_LABEL: assistantLabel });
}

export function buildCodexEntries(): ManagedEntry[] {
  return [
    { kind: 'directory', path: '.codex' },
    { kind: 'directory', path: '.codex/agents' },
    { kind: 'directory', path: '.codex/scripts' },
    { kind: 'directory', path: '.codex/skills' },
    { kind: 'directory', path: '.codex/skills/scaiff-repo-setup' },
    { kind: 'directory', path: '.codex/skills/scaiff-repo-setup/references' },
    { kind: 'directory', path: '.codex/skills/scaiff-repo-setup/assets' },
    { kind: 'directory', path: '.codex/templates' },
    { kind: 'directory', path: '.codex/workflows' },
    { kind: 'directory', path: '.codex/docker' },
    {
      kind: 'file',
      path: '.codex/README.md',
      content: (context) => codexReadme(codexCompatibilityLabel(context.assistant))
    },
    {
      kind: 'file',
      path: '.codex/workflows/parallel-execution.md',
      content: () => parallelExecutionWorkflow()
    },
    { kind: 'file', path: '.codex/agents/orchestrator.md', content: () => orchestrator() },
    { kind: 'file', path: '.codex/agents/implementer.md', content: () => implementer() },
    { kind: 'file', path: '.codex/agents/reviewer.md', content: () => reviewer() },
    { kind: 'file', path: '.codex/agents/gsd-cognee-advisor.md', content: () => gsdCogneeAdvisor() },
    {
      kind: 'file',
      path: '.codex/skills/scaiff-repo-setup/SKILL.md',
      content: () => scaiffRepoSetupSkill()
    },
    {
      kind: 'file',
      path: '.codex/skills/scaiff-repo-setup/references/scaiff-command-matrix.md',
      content: () => scaiffCommandMatrix()
    },
    {
      kind: 'file',
      path: '.codex/skills/scaiff-repo-setup/references/existing-repo-context-checklist.md',
      content: () => existingRepoContextChecklist()
    },
    {
      kind: 'file',
      path: '.codex/skills/scaiff-repo-setup/references/scaffold-customization-map.md',
      content: () => scaffoldCustomizationMap()
    },
    {
      kind: 'file',
      path: '.codex/skills/scaiff-repo-setup/references/manifest-discovery.md',
      content: () => manifestDiscoveryGuide()
    },
    {
      kind: 'file',
      path: '.codex/skills/scaiff-repo-setup/assets/adoption-notes-template.md',
      content: () => adoptionNotesTemplate()
    },
    {
      kind: 'file',
      path: '.codex/templates/phase-execution.md',
      content: () => phaseExecutionTemplate()
    },
    {
      kind: 'file',
      path: '.codex/scripts/cognee-bridge.sh',
      content: (context) => codexTemplate(context.appSlug, 'codex/scripts/cognee-bridge.sh'),
      executable: true
    },
    {
      kind: 'file',
      path: '.codex/scripts/cognee-sync-planning.sh',
      content: (context) => codexTemplate(context.appSlug, 'codex/scripts/cognee-sync-planning.sh'),
      executable: true
    },
    {
      kind: 'file',
      path: '.codex/scripts/cognee-brief.sh',
      content: (context) => codexTemplate(context.appSlug, 'codex/scripts/cognee-brief.sh'),
      executable: true
    },
    {
      kind: 'file',
      path: '.codex/scripts/sync-planning-to-cognee.sh',
      content: (context) => codexTemplate(context.appSlug, 'codex/scripts/sync-planning-to-cognee.sh'),
      executable: true
    },
    {
      kind: 'file',
      path: '.codex/scripts/bootstrap-worktree.sh',
      content: () => loadTemplate('codex/scripts/bootstrap-worktree.sh'),
      executable: true
    },
    {
      kind: 'file',
      path: '.codex/scripts/land.sh',
      content: (context) => codexTemplate(context.appSlug, 'codex/scripts/land.sh'),
      executable: true
    },
    {
      kind: 'file',
      path: '.codex/docker/Dockerfile.cognee',
      content: () => loadTemplate('codex/docker/Dockerfile.cognee')
    },
    {
      kind: 'file',
      path: 'AGENTS.md',
      content: (context) => agentsGuide(codexCompatibilityLabel(context.assistant))
    }
  ];
}
