import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Award } from "lucide-react";

import { useAchievements } from "../../contexts/AchievementsContext";
import { ACHIEVEMENTS, type AchievementDef } from "../../utils/achievements";

/**
 * One-time celebration for newly-unlocked achievements. Shows every pending
 * unlock together as a single card (not one popup per achievement) — a
 * retroactive burst of several at once shouldn't turn into a string of
 * full-screen takeovers interrupting navigation.
 */
function AchievementUnlockedOverlay() {
  const { newlyUnlockedIds, dismissAll } = useAchievements();
  const location = useLocation();
  const lastPath = useRef(location.pathname);

  const achievements = newlyUnlockedIds
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter((a): a is AchievementDef => a !== undefined);

  const totalXp = achievements.reduce((sum, a) => sum + a.xpReward, 0);

  useEffect(() => {
    if (achievements.length === 0) return;

    const timer = setTimeout(dismissAll, 3800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newlyUnlockedIds.join(","), dismissAll]);

  // Dismiss on navigation so a lingering celebration never sits over the
  // next page. (The backdrop is non-blocking, so the nav tap that triggered
  // the change already went through.)
  useEffect(() => {
    if (location.pathname !== lastPath.current) {
      lastPath.current = location.pathname;
      dismissAll();
    }
  }, [location.pathname, dismissAll]);

  return (
    <AnimatePresence>
      {achievements.length > 0 && (
        <motion.div
          key="achievement-unlock"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={dismissAll}
            className="pointer-events-auto mx-6 flex max-w-sm cursor-pointer flex-col items-center gap-3 rounded-3xl border border-lime/20 bg-gradient-to-br from-white/[0.06] to-transparent p-8 text-center shadow-[0_0_80px_-20px_rgba(198,255,52,0.5)]"
          >
            <motion.span
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 14 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-lime/15 text-lime"
            >
              <Award className="h-8 w-8" />
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sm font-medium uppercase tracking-wide text-zinc-400"
            >
              {achievements.length === 1
                ? "Achievement unlocked!"
                : `${achievements.length} achievements unlocked!`}
            </motion.p>

            {achievements.length === 1 ? (
              <>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.4 }}
                  className="text-2xl font-bold text-white"
                >
                  {achievements[0].title}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.36, duration: 0.4 }}
                  className="text-sm text-zinc-400"
                >
                  {achievements[0].description}
                </motion.p>
              </>
            ) : (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.4 }}
                className="w-full space-y-1.5 text-left"
              >
                {achievements.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-white">{a.title}</span>
                    <span className="text-xs text-zinc-500">+{a.xpReward} XP</span>
                  </li>
                ))}
              </motion.ul>
            )}

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.44, duration: 0.4 }}
              className="rounded-full bg-lime/10 px-3 py-1 text-xs font-semibold text-lime"
            >
              +{totalXp} XP total
            </motion.span>

            <p className="mt-1 text-xs text-zinc-500">Tap to dismiss</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AchievementUnlockedOverlay;
