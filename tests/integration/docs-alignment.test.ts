import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

describe('OMO docs alignment', () => {
  it('keeps landing guidance lane-aware across repo-facing docs', async () => {
    const rootReadme = await readFile(path.join(process.cwd(), 'README.md'), 'utf8');
    const harnessUsage = await readFile(path.join(process.cwd(), 'docs', 'harness-usage.md'), 'utf8');
    const operatorWorkflow = await readFile(path.join(process.cwd(), '.rules', 'patterns', 'operator-workflow.md'), 'utf8');
    const agentsGuide = await readFile(path.join(process.cwd(), 'AGENTS.md'), 'utf8');
    const autonomousWorkflow = await readFile(
      path.join(process.cwd(), '.codex', 'workflows', 'autonomous-execution.md'),
      'utf8'
    );
    const omoContract = await readFile(path.join(process.cwd(), '.rules', 'patterns', 'omo-agent-contract.md'), 'utf8');
    const templateAgentsGuide = await readFile(path.join(process.cwd(), 'src', 'templates', 'codex', 'AGENTS.md'), 'utf8');
    const templateCodexReadme = await readFile(path.join(process.cwd(), 'src', 'templates', 'codex', 'README.md'), 'utf8');
    const templateRootReadme = await readFile(path.join(process.cwd(), 'src', 'templates', 'root', 'README.md'), 'utf8');
    const templateAutonomousWorkflow = await readFile(
      path.join(process.cwd(), 'src', 'templates', 'codex', 'workflows', 'autonomous-execution.md'),
      'utf8'
    );
    const orchestratorGuide = await readFile(path.join(process.cwd(), '.codex', 'agents', 'orchestrator.md'), 'utf8');
    const templateOrchestratorGuide = await readFile(
      path.join(process.cwd(), 'src', 'templates', 'codex', 'agents', 'orchestrator.md'),
      'utf8'
    );
    const templateOmoContract = await readFile(
      path.join(process.cwd(), 'src', 'templates', 'rules', 'patterns', 'omo-agent-contract.md'),
      'utf8'
    );

    const migratedDocs = [
      rootReadme,
      harnessUsage,
      agentsGuide,
      templateAgentsGuide,
      templateCodexReadme,
      templateRootReadme,
    ];

    for (const doc of migratedDocs) {
      expect(doc).not.toContain('/gsd-next');
      expect(doc).not.toContain('/gsd-discuss-phase');
      expect(doc).not.toContain('/gsd-plan-phase');
      expect(doc).not.toContain('/gsd-execute-phase');
      expect(doc).not.toContain('/gsd-verify-work');
      expect(doc).not.toContain('/gsd-autonomous');
      expect(doc).not.toContain('/gsd-resume-work');
      expect(doc).not.toContain('~/.gsd/defaults.json');
    }

    expect(rootReadme).toContain('## Beads + OMO loop');
    expect(rootReadme).toContain('Use `.rules/patterns/omo-agent-contract.md` for lane authority, Cognee fallback, and landing rules.');
    expect(rootReadme).toContain('execution/autonomous landing lane runs `./.codex/scripts/land.sh`');
    expect(rootReadme).not.toContain('\n./.codex/scripts/land.sh\n');
    expect(harnessUsage).toContain('Use the daily Beads + OMO loop from `.rules/patterns/operator-workflow.md`.');
    expect(harnessUsage).toContain('Execute and verify from `.rules/patterns/operator-workflow.md` and `.codex/workflows/autonomous-execution.md`.');
    expect(harnessUsage).toContain('execution/autonomous landing lane runs `./.codex/scripts/land.sh`');
    expect(harnessUsage).not.toContain('\n./.codex/scripts/land.sh\n');
    expect(harnessUsage).toContain('planning, research, and review lanes should hand off instead of publishing');
    expect(agentsGuide).toContain('Prefer the loop `bd ready -> claim -> cognee brief -> implement -> verify -> bd close`');
    expect(operatorWorkflow).toContain('If you are in an execution/autonomous landing lane, finish the branch with `./.codex/scripts/land.sh`');
    expect(operatorWorkflow).not.toContain('Finish the branch with `./.codex/scripts/land.sh`');
    expect(agentsGuide).toContain('When ending an execution/autonomous landing session');
    expect(agentsGuide).toContain('Planning, research, and review lanes must hand off instead of pushing or publishing.');
    expect(autonomousWorkflow).toContain('planning, research, or review lanes must stop with a handoff instead of publishing');
    expect(omoContract).toContain('never publish from planning, research, or review lanes');
    expect(omoContract).toContain('Cognee attempt before broader repo exploration');
    expect(templateAgentsGuide).toContain('Planning, research, and review lanes must hand off instead of publishing.');
    expect(templateAgentsGuide).toContain('Initialize Beads with `bd init` if needed, then start from `bd ready --json` and claim one issue.');
    expect(templateCodexReadme).toContain('For planning, research, or autonomous startup work, generate a knowledge brief with `./.codex/scripts/cognee-brief.sh` before broad repo exploration.');
    expect(templateRootReadme).toContain('OMO policy, Beads, and Cognee');
    expect(templateAutonomousWorkflow).toContain('planning, research, or review lanes must stop with a handoff instead of publishing');
    expect(orchestratorGuide).toContain('Generate a Cognee brief before major planning or research, and consume the latest brief during execution when one exists');
    expect(orchestratorGuide).not.toContain('Generate a Cognee brief before major planning or execution');
    expect(templateOrchestratorGuide).toContain('Generate a Cognee brief before major planning or research, and consume the latest brief during execution when one exists');
    expect(templateOrchestratorGuide).not.toContain('Generate a Cognee brief before major planning or execution');
    expect(templateOmoContract).toContain('never publish from planning, research, or review lanes');
    expect(templateOmoContract).toContain('Cognee attempt before broader repo exploration');
  });
});
