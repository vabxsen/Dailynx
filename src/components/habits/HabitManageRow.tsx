import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check, X, Flame } from "lucide-react";

import type { Habit } from "../../services/habitService";

type Props = {
  habit: Habit;
  currentStreak: number;
  bestStreak: number;
  monthlyCount: number;
  onEdit: (patch: { title: string; time: string }) => void;
  onDelete: () => void;
};

function HabitManageRow({
  habit,
  currentStreak,
  bestStreak,
  monthlyCount,
  onEdit,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(habit.title);
  const [time, setTime] = useState(habit.time || "09:00");

  const save = () => {
    if (!title.trim()) return;
    onEdit({ title: title.trim(), time });
    setEditing(false);
  };

  const cancel = () => {
    setTitle(habit.title);
    setTime(habit.time || "09:00");
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
    >
      {editing ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            autoFocus
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none focus:border-lime/50"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white outline-none focus:border-lime/50"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              aria-label="Save"
              className="rounded-xl bg-lime p-2.5 text-ink transition hover:brightness-95"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={cancel}
              aria-label="Cancel"
              className="rounded-xl border border-white/10 p-2.5 text-zinc-300 transition hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {habit.time && (
                <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-300">
                  {habit.time}
                </span>
              )}
              <span className="truncate font-medium text-white">
                {habit.title}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
              <span className="flex items-center gap-1 text-lime">
                <Flame className="h-3.5 w-3.5" />
                {currentStreak}d streak
              </span>
              <span className="text-zinc-600">·</span>
              <span>{monthlyCount} this month</span>
              <span className="text-zinc-600">·</span>
              <span>best {bestStreak}</span>
            </div>
          </div>

          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => setEditing(true)}
              aria-label="Edit habit"
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              aria-label="Delete habit"
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default HabitManageRow;
