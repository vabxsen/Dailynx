import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";

type HabitCardProps = {
  title: string;
  time: string;
  completed: boolean;
  currentStreak: number;
  monthlyCount: number;
  onToggle: () => void;
};

function HabitCard({
  title,
  time,
  completed,
  currentStreak,
  monthlyCount,
  onToggle,
}: HabitCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
        completed
          ? "border-lime/30 bg-lime/[0.06]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onToggle}
        aria-label={completed ? "Mark as not done" : "Mark as done"}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition ${
          completed
            ? "border-lime bg-lime text-ink"
            : "border-zinc-600 text-transparent hover:border-lime"
        }`}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </motion.button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {time && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-300">
              {time}
            </span>
          )}
          <span
            className={`truncate font-medium ${
              completed ? "text-zinc-500 line-through" : "text-white"
            }`}
          >
            {title}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1 text-lime">
            <Flame className="h-3.5 w-3.5" />
            {currentStreak} day{currentStreak === 1 ? "" : "s"}
          </span>
          <span className="text-zinc-600">·</span>
          <span>{monthlyCount} this month</span>
        </div>
      </div>
    </motion.div>
  );
}

export default HabitCard;
