import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useHabits } from "../../contexts/HabitsContext";
import { useXp } from "../../contexts/XPContext";
import { currentStreak } from "../../utils/streak";
import {
  askAiCoach,
  isAiEnabled,
  type ChatMessage,
} from "../../services/aiService";
import AICoachPanel from "./AICoachPanel";

/** Compact entry point for the AI coach, sized to sit beside the XP bar. Hidden if no key is configured. */
function AICoachButton() {
  const { habits, today } = useHabits();
  const { level } = useXp();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAiEnabled) return null;

  const stats = {
    level: level.level,
    totalXp: level.totalXp,
    xpIntoLevel: level.xpIntoLevel,
    xpForNextLevel: level.xpForNextLevel,
    isMaxLevel: level.isMaxLevel,
    bestActiveStreak: habits.reduce(
      (max, h) => Math.max(max, currentStreak(h.completedDates, today)),
      0
    ),
    habitsCount: habits.length,
  };

  const ask = (history: ChatMessage[]) => {
    setLoading(true);
    setError(null);

    return askAiCoach(history, stats)
      .then((text) =>
        setMessages((prev) => [...prev, { role: "model", text }])
      )
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Something went wrong.")
      )
      .finally(() => setLoading(false));
  };

  // Opening the panel is the user interaction that kicks off the first,
  // one-time motivational check-in — not something to sync via an effect.
  const openCoach = () => {
    setOpen(true);
    if (messages.length === 0) {
      ask([{ role: "user", text: "Give me a short motivational check-in for today." }]);
    }
  };

  const send = (text: string) => {
    const next: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(next);
    ask(next);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={openCoach}
        aria-label="Open Dailynx Coach"
        title="Dailynx Coach"
        className="group flex h-full shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition hover:border-lime/30 hover:bg-white/[0.04]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/15 text-lime transition group-hover:bg-lime/25">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="text-xs font-medium text-zinc-400 transition group-hover:text-lime">
          AI Coach
        </span>
      </motion.button>

      <AICoachPanel
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        loading={loading}
        error={error}
        onSend={send}
      />
    </>
  );
}

export default AICoachButton;
