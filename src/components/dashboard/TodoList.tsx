import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Check, X } from "lucide-react";

import type { Todo } from "../../services/todoService";

type Props = {
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TodoList({ todos, onAdd, onToggle, onDelete }: Props) {
  const [text, setText] = useState("");

  const remaining = todos.filter((t) => !t.done).length;

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">To-do list</h2>
        <span className="text-sm text-zinc-400">{remaining} left</span>
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add a task…"
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime/50"
        />
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={submit}
          aria-label="Add task"
          className="flex items-center justify-center rounded-xl bg-lime px-3 text-ink transition hover:brightness-95"
        >
          <Plus className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="mt-4 space-y-2">
        {todos.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No tasks yet — add one above.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="group flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5"
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onToggle(todo.id)}
                  aria-label={todo.done ? "Mark not done" : "Mark done"}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                    todo.done
                      ? "border-lime bg-lime text-ink"
                      : "border-zinc-600 text-transparent hover:border-lime"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.button>

                <span
                  className={`flex-1 text-sm ${
                    todo.done ? "text-zinc-500 line-through" : "text-white"
                  }`}
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => onDelete(todo.id)}
                  aria-label="Delete task"
                  className="shrink-0 rounded-lg p-1.5 text-zinc-500 opacity-100 transition hover:bg-red-500/10 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default TodoList;
