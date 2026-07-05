import { motion } from "framer-motion";
import { Flame, CheckCircle2, Sparkles, CalendarCheck, type LucideIcon } from "lucide-react";

import PageHeader from "../../components/layout/PageHeader";
import AchievementCard from "../../components/achievements/AchievementCard";
import { useHabits } from "../../contexts/HabitsContext";
import { useAchievements } from "../../contexts/AchievementsContext";
import {
  ACHIEVEMENTS,
  computeAchievementProgress,
  type AchievementCategory,
} from "../../utils/achievements";

const CATEGORY_META: Record<AchievementCategory, { label: string; icon: LucideIcon }> = {
  streak: { label: "Streaks", icon: Flame },
  completions: { label: "Completions", icon: CheckCircle2 },
  perfectWeek: { label: "Perfect Weeks", icon: Sparkles },
  activeDays: { label: "Consistency", icon: CalendarCheck },
};

const CATEGORY_ORDER: AchievementCategory[] = [
  "streak",
  "completions",
  "perfectWeek",
  "activeDays",
];

function AchievementsPage() {
  const { habits, today } = useHabits();
  const { unlocked } = useAchievements();

  const progress = computeAchievementProgress(habits, today);
  const progressById = new Map(progress.map((p) => [p.id, p]));
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlocked[a.id]).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        subtitle={`${unlockedCount} / ${ACHIEVEMENTS.length} unlocked`}
      />

      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category];
        const items = ACHIEVEMENTS.filter((a) => a.category === category);

        return (
          <section key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <meta.icon className="h-4 w-4 text-zinc-400" />
              <h2 className="text-lg font-bold text-white">{meta.label}</h2>
            </div>

            <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  current={progressById.get(achievement.id)?.current ?? 0}
                  unlockedAt={unlocked[achievement.id]?.unlockedAt ?? null}
                />
              ))}
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}

export default AchievementsPage;
