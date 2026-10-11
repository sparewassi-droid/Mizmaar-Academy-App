import { Tier, AgeGroup } from '../types';
import { EXPLORER_THEME } from '../theme/explorer';
import { SCHOLAR_THEME } from '../theme/scholar';

export const TIER_MULTIPLIERS: Record<Tier, number> = {
  easy: 1,
  moderate: 1.5,
  difficult: 2,
};

export function calculatePoints(
  tier: Tier,
  isCorrect: boolean,
  secondsLeft: number,
  totalSeconds: number,
  currentStreak: number
): { points: number; basePoints: number; speedBonus: number; streakBonus: number } {
  if (!isCorrect) {
    return { points: 0, basePoints: 0, speedBonus: 0, streakBonus: 0 };
  }

  const multiplier = TIER_MULTIPLIERS[tier];
  const basePoints = Math.round(100 * multiplier);

  // Speed bonus up to 50 * multiplier * (secondsLeft / totalSeconds)
  const ratio = totalSeconds > 0 ? Math.max(0, Math.min(1, secondsLeft / totalSeconds)) : 0;
  const speedBonus = Math.round(50 * multiplier * ratio);

  // Streak bonus: +10 for each consecutive correct answer beyond the 2nd, capped at +50
  let streakBonus = 0;
  if (currentStreak > 2) {
    streakBonus = Math.min(50, (currentStreak - 2) * 10);
  }

  const points = basePoints + speedBonus + streakBonus;
  return { points, basePoints, speedBonus, streakBonus };
}

export function calculateStars(accuracyPercent: number): number {
  if (accuracyPercent >= 95) return 3;
  if (accuracyPercent >= 80) return 2;
  if (accuracyPercent >= 60) return 1;
  return 0;
}

export const LEVEL_THRESHOLDS = [0, 150, 400, 800, 1400, 2200];

export function getLevelInfo(
  xp: number,
  ageGroup: AgeGroup
): { level: number; title: string; currentLevelXp: number; nextLevelXp: number; progress: number } {
  const titles = ageGroup === '7-11' ? EXPLORER_THEME.levelTitles : SCHOLAR_THEME.levelTitles;

  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  level = Math.min(level, titles.length);

  const title = titles[level - 1] || titles[0];
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[level - 1] + 1000;
  const diff = nextThreshold - currentThreshold;
  const progress = diff > 0 ? Math.min(1, Math.max(0, (xp - currentThreshold) / diff)) : 1;

  return {
    level,
    title,
    currentLevelXp: currentThreshold,
    nextLevelXp: nextThreshold,
    progress,
  };
}
