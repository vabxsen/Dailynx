import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

type Props = {
  onAdd: (title: string, time: string) => void;
};

function AddHabit({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");

  const handleAdd = () => {
    if (!title.trim()) return;

    onAdd(title, time);
    setTitle("");
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 sm:flex-row">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Add a new habit…"
        className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime/50"
      />

      <div className="flex gap-3">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-white outline-none transition focus:border-lime/50"
        />

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-lime px-5 py-3 font-semibold text-ink transition hover:brightness-95"
        >
          <Plus className="h-4 w-4" />
          Add
        </motion.button>
      </div>
    </div>
  );
}

export default AddHabit;
