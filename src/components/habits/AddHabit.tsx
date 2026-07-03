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
    <div className="flex gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="New Habit..."
        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl text-white font-semibold"
      >
        Add
      </button>
    </div>
  );
}

export default AddHabit;
