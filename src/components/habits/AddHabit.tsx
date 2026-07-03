import { useState } from "react";

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
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3 sm:flex-row">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Add a new habit…"
        className="flex-1 rounded-xl bg-slate-800/60 px-4 py-3 text-white outline-none ring-violet-500 placeholder:text-slate-500 focus:ring-2"
      />

      <div className="flex gap-3">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-xl bg-slate-800/60 px-3 py-3 text-white outline-none ring-violet-500 focus:ring-2"
        />

        <button
          onClick={handleAdd}
          className="rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default AddHabit;
