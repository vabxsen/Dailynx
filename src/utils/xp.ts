/**
 * XP / level math. Accounts start at Level 0 (0 XP). Each level-up costs
 * 50 XP more than the previous one: 0→1 needs 100, 1→2 needs 150, 2→3 needs
 * 200, and so on, capped at Level 100. So the *total* XP to reach level L is
 *   sum_{i=0}^{L-1} (100 + 50i) = 100·L + 25·L·(L−1)
 * All functions are pure so level-up detection can just diff
 * levelFromXp(before) against levelFromXp(after).
 */

export const MAX_LEVEL = 100;

/** Total (cumulative) XP required to have reached a given level. */
export function xpForLevel(level: number): number {
  const l = Math.max(0, Math.min(level, MAX_LEVEL));

  return 100 * l + 25 * l * (l - 1);
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

  // Closed-form inverse of xpForLevel, then a correction step so exact
  // thresholds never fall on the wrong side of a floating-point rounding.
  let level = Math.floor((-75 + Math.sqrt(5625 + 100 * xp)) / 50);
  level = Math.max(0, Math.min(level, MAX_LEVEL));
  while (level < MAX_LEVEL && xpForLevel(level + 1) <= xp) level++;
  while (level > 0 && xpForLevel(level) > xp) level--;

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
