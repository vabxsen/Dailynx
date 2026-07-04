import { motion } from "framer-motion";
import { Zap } from "lucide-react";

import { useXp } from "../../contexts/XPContext";

/** Full-size level + XP progress card, shown on the Dashboard. */
function XPBar() {
  const { level } = useXp();

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/15 text-lime">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-white">Level {level.level}</p>
            <p className="text-xs text-zinc-500">
              {level.isMaxLevel
                ? `${level.totalXp} XP total`
                : `${level.xpIntoLevel} / ${level.xpForNextLevel} XP`}
            </p>
          </div>
        </div>

        {level.isMaxLevel ? (
          <span className="rounded-full bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
            Max level
          </span>
        ) : (
          <span className="text-sm text-zinc-400">
            {Math.round(level.progress * 100)}%
          </span>
        )}
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-lime"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(level.progress, 1) * 100}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default XPBar;
