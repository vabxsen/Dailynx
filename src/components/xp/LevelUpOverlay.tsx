import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";

import { useXp } from "../../contexts/XPContext";

/** One-time full-screen celebration, shown whenever the level increases. */
function LevelUpOverlay() {
  const { levelUpEvent, clearLevelUpEvent } = useXp();

  useEffect(() => {
    if (levelUpEvent === null) return;

    const timer = setTimeout(clearLevelUpEvent, 2800);
    return () => clearTimeout(timer);
  }, [levelUpEvent, clearLevelUpEvent]);

  return (
    <AnimatePresence>
      {levelUpEvent !== null && (
        <motion.div
          key="level-up"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={clearLevelUpEvent}
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
              <Trophy className="h-8 w-8" />
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sm font-medium uppercase tracking-wide text-zinc-400"
            >
              Level up!
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
              className="text-4xl font-bold text-white"
            >
              Level {levelUpEvent}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-xs text-zinc-500"
            >
              Tap anywhere to dismiss
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LevelUpOverlay;
