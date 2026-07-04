/**
 * XP / level math. Level 1 starts at 0 XP; Level 2 needs 100 total XP, and
 * every level after that needs 50 more total XP than the last, capped at
 * Level 100. All functions are pure so level-up detection can just diff
 * levelFromXp(before) against levelFromXp(after).
 */

export const MAX_LEVEL = 100;

/** Total (cumulative) XP required to have reached a given level. */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;

  return 100 + (level - 2) * 50;
}

export interface LevelInfo {
  level: number;
  totalXp: number;
  /** XP earned past this level's threshold. */
  xpIntoLevel: number;
  /** XP needed to go from this level to the next (0 if maxed). */
  xpForNextLevel: number;
  /** 0–1 progress toward the next level. Always 1 at Level 100. */
  progress: number;
  isMaxLevel: boolean;
}

export function levelFromXp(totalXp: number): LevelInfo {
  const xp = Math.max(0, totalXp);

  let level = 1;
  if (xp >= xpForLevel(2)) {
    level = 2 + Math.floor((xp - xpForLevel(2)) / 50);
  }
  level = Math.min(level, MAX_LEVEL);

  const isMaxLevel = level >= MAX_LEVEL;
  const currentThreshold = xpForLevel(level);
  const nextThreshold = isMaxLevel ? currentThreshold : xpForLevel(level + 1);

  const xpIntoLevel = xp - currentThreshold;
  const xpForNextLevel = nextThreshold - currentThreshold;

  return {
    level,
    totalXp: xp,
    xpIntoLevel,
    xpForNextLevel,
    progress: isMaxLevel ? 1 : xpIntoLevel / xpForNextLevel,
    isMaxLevel,
  };
}
