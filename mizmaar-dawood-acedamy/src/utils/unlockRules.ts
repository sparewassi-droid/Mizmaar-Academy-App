import { ModuleProgress, Tier, ModuleDefinition } from '../types';

export type NodeState = 'locked' | 'available' | 'passed' | 'mastered';

export function getNodeState(
  moduleProgress: ModuleProgress | undefined,
  tier: Tier,
  isRegionUnlocked: boolean,
  allRegionsUnlocked: boolean
): NodeState {
  if (allRegionsUnlocked) {
    const stage = moduleProgress?.stages[tier];
    if (stage?.passed) {
      return stage.stars === 3 ? 'mastered' : 'passed';
    }
    return 'available';
  }

  if (!isRegionUnlocked || !moduleProgress) {
    return 'locked';
  }

  const { stages } = moduleProgress;

  if (tier === 'easy') {
    if (stages.easy.passed) {
      return stages.easy.stars === 3 ? 'mastered' : 'passed';
    }
    return 'available';
  }

  if (tier === 'moderate') {
    if (!stages.easy.passed) {
      return 'locked';
    }
    if (stages.moderate.passed) {
      return stages.moderate.stars === 3 ? 'mastered' : 'passed';
    }
    return 'available';
  }

  if (tier === 'difficult') {
    if (!stages.moderate.passed) {
      return 'locked';
    }
    if (stages.difficult.passed) {
      return stages.difficult.stars === 3 ? 'mastered' : 'passed';
    }
    return 'available';
  }

  return 'locked';
}

export function isRegionUnlocked(
  regionIndex: number,
  moduleDefs: ModuleDefinition[],
  modulesProgress: Record<string, ModuleProgress>,
  allRegionsUnlocked: boolean
): boolean {
  if (allRegionsUnlocked || regionIndex === 0) {
    return true;
  }

  // The NEXT region opens when the MODERATE stage of the PREVIOUS region is passed!
  const prevModuleDef = moduleDefs[regionIndex - 1];
  if (!prevModuleDef) return true;

  const prevProgress = modulesProgress[prevModuleDef.id];
  return !!prevProgress?.stages.moderate.passed;
}

export function checkAllSealsEarned(
  moduleDefs: ModuleDefinition[],
  modulesProgress: Record<string, ModuleProgress>
): boolean {
  for (const mod of moduleDefs) {
    const prog = modulesProgress[mod.id];
    if (!prog) return false;
    const { easy, moderate, difficult } = prog.stages;
    if (!easy.passed || !moderate.passed || !difficult.passed) {
      return false;
    }
  }
  return true;
}
