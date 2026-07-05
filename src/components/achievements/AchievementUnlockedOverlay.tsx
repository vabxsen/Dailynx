import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award } from "lucide-react";

import { useAchievements } from "../../contexts/AchievementsContext";
import { ACHIEVEMENTS } from "../../utils/achievements";

/** One-time celebration for each newly-unlocked achievement, shown one at a time. */
function AchievementUnlockedOverlay() {
  const { newlyUnlockedIds, dismissOldest } = useAchievements();
  const currentId = newlyUnlockedIds[0] ?? null;
  const achievement = currentId ? ACHIEVEMENTS.find((a) => a.id === currentId) ?? null : null;

  useEffect(() => {
    if (!currentId) return;

    const timer = setTimeout(dismissOldest, 3200);
    return () => clearTimeout(timer);
  }, [currentId, dismissOldest]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={dismissOldest}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-ink/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="mx-6 flex flex-col items-center gap-3 rounded-3xl border border-lime/20 bg-gradient-to-br from-white/[0.06] to-transparent p-8 text-center shadow-[0_0_80px_-20px_rgba(198,255,52,0.5)]"
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
              Achievement unlocked!
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
              className="text-2xl font-bold text-white"
            >
              {achievement.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.4 }}
              className="max-w-xs text-sm text-zinc-400"
            >
              {achievement.description}
            </motion.p>

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.44, duration: 0.4 }}
              className="rounded-full bg-lime/10 px-3 py-1 text-xs font-semibold text-lime"
            >
              +{achievement.xpReward} XP
            </motion.span>

            <p className="mt-1 text-xs text-zinc-500">Tap anywhere to dismiss</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AchievementUnlockedOverlay;
