import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Send, X } from "lucide-react";

import type { ChatMessage } from "../../services/aiService";

type Props = {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (text: string) => void;
};

function AICoachPanel({ open, onClose, messages, loading, error, onSend }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;

    onSend(text);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative flex h-[min(32rem,85vh)] w-full max-w-md flex-col rounded-t-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl sm:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime/15 text-lime">
                  <Sparkles className="h-4 w-4" />
                </span>
                <p className="font-semibold text-white">Dailynx Coach</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-lime text-ink"
                      : "bg-white/[0.05] text-zinc-200"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {loading && (
                <div className="flex w-fit items-center gap-1.5 rounded-2xl bg-white/[0.05] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                </div>
              )}

              {error && (
                <p className="rounded-2xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                  {error}
                </p>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 border-t border-white/[0.06] p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask how to use Dailynx…"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-lime/50"
              />
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="flex items-center justify-center rounded-xl bg-lime px-3 text-ink transition hover:brightness-95 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AICoachPanel;
