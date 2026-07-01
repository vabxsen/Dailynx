import { useState } from "react";

type Props = {
  onAdd: (title: string) => void;
};

function AddHabit({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    onAdd(title);
    setTitle("");
  };

  return (
    <div className="flex gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Habit..."
        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none"
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