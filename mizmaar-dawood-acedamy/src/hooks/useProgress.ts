import { useState, useEffect, useCallback } from 'react';
import {
  ProgressState,
  AgeGroup,
  Tier,
  StageResultSummary,
  ModuleProgress,
  TodaysQuest,
} from '../types';
import { getLevelInfo } from '../utils/scoring';
import { MODULE_DEFINITIONS } from '../data/modules';

const STORAGE_KEY = 'tajweed_quest_progress_v1';

const DAILY_QUESTS = [
  { id: 'q_pass_any', title: 'Pass any stage', rewardXp: 20 },
  { id: 'q_earn_3stars', title: 'Earn 3 stars on one stage', rewardXp: 20 },
  { id: 'q_score_200', title: 'Score over 200 points in a stage', rewardXp: 20 },
  { id: 'q_moderate', title: 'Complete a Moderate challenge', rewardXp: 20 },
];

function getDailyQuest(): TodaysQuest {
  const todayStr = new Date().toISOString().slice(0, 10);
  const dayIndex = Math.abs(
    todayStr.split('-').reduce((acc, p) => acc * 31 + parseInt(p, 10), 0)
  ) % DAILY_QUESTS.length;
  const quest = DAILY_QUESTS[dayIndex];
  return {
    id: quest.id,
    title: quest.title,
    completed: false,
    date: todayStr,
    rewardXp: quest.rewardXp,
  };
}

export function getDefaultModules(): Record<string, ModuleProgress> {
  const mods: Record<string, ModuleProgress> = {};
  for (const [id] of Object.entries(MODULE_DEFINITIONS)) {
    mods[id] = {
      id,
      unlocked: id === 'a1_basic_tajweed' || id === 'b1_advanced_tajweed',
      stages: {
        easy: { passed: false, stars: 0, bestScore: 0, bestAccuracy: 0, attempts: 0 },
        moderate: { passed: false, stars: 0, bestScore: 0, bestAccuracy: 0, attempts: 0 },
        difficult: { passed: false, stars: 0, bestScore: 0, bestAccuracy: 0, attempts: 0 },
      },
      sealEarned: false,
    };
  }
  return mods;
}

export function getDefaultProgress(
  initialAgeGroup: AgeGroup = '7-11',
  user?: { id: string; username: string }
): ProgressState {
  const levelInfo = getLevelInfo(0, initialAgeGroup);
  return {
    userId: user?.id || 'seeker_' + Math.random().toString(36).substring(2, 8),
    username: user?.username || 'seeker',
    ageGroup: initialAgeGroup,
    levelTitle: levelInfo.title,
    level: 1,
    xp: 0,
    totalPoints: 0,
    totalStars: 0,
    modules: getDefaultModules(),
    todaysQuest: getDailyQuest(),
    grownUps: {
      onlinePlayEnabled: true,
      timerMode: 'normal',
      allRegionsUnlocked: false,
    },
    friends: [],
    friendRequests: [],
    blockedUsers: [],
    reportedUsers: [],
  };
}

export function useProgress(
  initialAgeGroup: AgeGroup = '7-11',
  user?: { id: string; username: string },
  onProgressChange?: (progress: ProgressState) => void
) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.userId && parsed.modules) {
          // Verify daily quest
          const today = new Date().toISOString().slice(0, 10);
          if (parsed.todaysQuest?.date !== today) {
            parsed.todaysQuest = getDailyQuest();
          }
          if (user) {
            parsed.userId = user.id;
            parsed.username = user.username;
          }
          // Ensure all modules are defined in case of updates
          const defaults = getDefaultModules();
          for (const key of Object.keys(defaults)) {
            if (!parsed.modules[key]) {
              parsed.modules[key] = defaults[key];
            }
          }
          return parsed;
        }
      }
    } catch {
      // Corrupted storage recovery: safe fallback
    }
    return getDefaultProgress(initialAgeGroup, user);
  });

  // Save changes to localStorage safely
  const saveProgress = useCallback(
    (newState: ProgressState) => {
      setProgress(newState);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch {
        // Safe fail
      }
      onProgressChange?.(newState);
    },
    [onProgressChange]
  );

  const setAgeGroup = useCallback(
    (ageGroup: AgeGroup) => {
      const levelInfo = getLevelInfo(progress.xp, ageGroup);
      const updated: ProgressState = {
        ...progress,
        ageGroup,
        levelTitle: levelInfo.title,
        level: levelInfo.level,
      };
      saveProgress(updated);
    },
    [progress, saveProgress]
  );

  const setUsername = useCallback(
    (username: string) => {
      const updated: ProgressState = {
        ...progress,
        username,
      };
      saveProgress(updated);
    },
    [progress, saveProgress]
  );

  const completeStage = useCallback(
    (result: StageResultSummary) => {
      const { moduleId, tier, stars, points, accuracy } = result;
      const currentModule = progress.modules[moduleId] || {
        id: moduleId,
        unlocked: true,
        stages: {
          easy: { passed: false, stars: 0, bestScore: 0, bestAccuracy: 0, attempts: 0 },
          moderate: { passed: false, stars: 0, bestScore: 0, bestAccuracy: 0, attempts: 0 },
          difficult: { passed: false, stars: 0, bestScore: 0, bestAccuracy: 0, attempts: 0 },
        },
        sealEarned: false,
      };

      const stageBefore = currentModule.stages[tier];
      const newlyPassed = stars > 0;
      const passed = stageBefore.passed || newlyPassed;
      const bestStars = Math.max(stageBefore.stars, stars);
      const bestScore = Math.max(stageBefore.bestScore, points);
      const bestAccuracy = Math.max(stageBefore.bestAccuracy, accuracy);

      const updatedStages = {
        ...currentModule.stages,
        [tier]: {
          passed,
          stars: bestStars,
          bestScore,
          bestAccuracy,
          attempts: stageBefore.attempts + 1,
        },
      };

      const allThreePassed =
        updatedStages.easy.passed &&
        updatedStages.moderate.passed &&
        updatedStages.difficult.passed;

      const updatedModules = {
        ...progress.modules,
        [moduleId]: {
          ...currentModule,
          stages: updatedStages,
          sealEarned: allThreePassed,
        },
      };

      // Recalculate total stars and points
      let totalStars = 0;
      let totalPoints = progress.totalPoints + points;
      let xpGained = Math.floor(points / 10);

      // Check daily quest
      let todaysQuest = { ...progress.todaysQuest };
      if (!todaysQuest.completed) {
        let questDone = false;
        if (todaysQuest.id === 'q_pass_any' && newlyPassed) questDone = true;
        if (todaysQuest.id === 'q_earn_3stars' && stars === 3) questDone = true;
        if (todaysQuest.id === 'q_score_200' && points >= 200) questDone = true;
        if (todaysQuest.id === 'q_moderate' && tier === 'moderate' && newlyPassed) questDone = true;

        if (questDone) {
          todaysQuest = { ...todaysQuest, completed: true };
          xpGained += todaysQuest.rewardXp;
        }
      }

      for (const mod of Object.values(updatedModules)) {
        totalStars += mod.stages.easy.stars + mod.stages.moderate.stars + mod.stages.difficult.stars;
      }

      const newXp = progress.xp + xpGained;
      const levelInfo = getLevelInfo(newXp, progress.ageGroup);

      const updatedState: ProgressState = {
        ...progress,
        modules: updatedModules,
        totalStars,
        totalPoints,
        xp: newXp,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
        todaysQuest,
      };

      saveProgress(updatedState);
    },
    [progress, saveProgress]
  );

  const resetProgress = useCallback(() => {
    const clean = getDefaultProgress(progress.ageGroup, user);
    saveProgress(clean);
  }, [progress.ageGroup, user, saveProgress]);

  const updateGrownUps = useCallback(
    (settings: Partial<ProgressState['grownUps']>) => {
      const updated: ProgressState = {
        ...progress,
        grownUps: {
          ...progress.grownUps,
          ...settings,
        },
      };
      saveProgress(updated);
    },
    [progress, saveProgress]
  );

  return {
    progress,
    setAgeGroup,
    setUsername,
    completeStage,
    resetProgress,
    updateGrownUps,
    saveProgress,
  };
}
