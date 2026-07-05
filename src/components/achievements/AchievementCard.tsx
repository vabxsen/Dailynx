import { motion } from "framer-motion";
import { Flame, CheckCircle2, Sparkles, CalendarCheck, Lock, type LucideIcon } from "lucide-react";

import type { AchievementCategory, AchievementDef } from "../../utils/achievements";

type Props = {
  achievement: AchievementDef;
  current: number;
  unlockedAt: number | null;
};

const CATEGORY_ICON: Record<AchievementCategory, LucideIcon> = {
  streak: Flame,
  completions: CheckCircle2,
  perfectWeek: Sparkles,
  activeDays: CalendarCheck,
};

function AchievementCard({ achievement, current, unlockedAt }: Props) {
  const Icon = CATEGORY_ICON[achievement.category];
  const unlocked = unlockedAt !== null;
  const progress = Math.min(current / achievement.threshold, 1);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-2xl border p-5 transition ${
        unlocked
          ? "border-lime/20 bg-gradient-to-br from-lime/[0.08] to-transparent"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            unlocked ? "bg-lime/15 text-lime" : "bg-white/5 text-zinc-500"
          }`}
        >
          {unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-semibold ${unlocked ? "text-white" : "text-zinc-300"}`}>
              {achievement.title}
            </p>
            <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-zinc-400">
              +{achievement.xpReward} XP
            </span>
          </div>
          <p className="mt-0.5 text-sm text-zinc-500">{achievement.description}</p>

          {unlocked ? (
            <p className="mt-2 text-xs text-lime">
              Unlocked{" "}
              {new Date(unlockedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          ) : (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-zinc-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                {Math.min(current, achievement.threshold)} / {achievement.threshold}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AchievementCard;
