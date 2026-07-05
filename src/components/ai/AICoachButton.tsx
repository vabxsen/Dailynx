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

/** Floating entry point for the AI coach — hidden entirely if no key is configured. */
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
        whileTap={{ scale: 0.92 }}
        onClick={openCoach}
        aria-label="Open AI coach"
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-lime text-ink shadow-[0_8px_30px_-8px_rgba(198,255,52,0.6)] transition hover:brightness-95 md:bottom-6 md:right-6"
      >
        <Sparkles className="h-6 w-6" />
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
