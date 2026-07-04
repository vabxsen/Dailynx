import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useXp } from "../contexts/XPContext";
import {
  getTodos,
  addTodo as addToFirestore,
  toggleTodo as toggleInFirestore,
  deleteTodo as deleteFromFirestore,
  sortTodos,
  type Todo,
} from "../services/todoService";
import { awardTodoXp } from "../services/xpService";

export function useTodos() {
  const { user } = useAuth();
  const { taskXpReward } = useXp();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!user) return;

      const data = await getTodos(user.uid);
      if (active) setTodos(data);
    })();

    return () => {
      active = false;
    };
  }, [user]);

  const addTodo = async (text: string) => {
    if (!user || !text.trim()) return;

    await addToFirestore(user.uid, text.trim());
    setTodos(await getTodos(user.uid));
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo || !user) return;

    const done = !todo.done;

    setTodos((prev) =>
      sortTodos(prev.map((t) => (t.id === id ? { ...t, done } : t)))
    );

    await toggleInFirestore(id, done);

    // Unchecking never touches XP — it's only ever granted once, permanently,
    // the first time a task is marked done.
    if (done) {
      await awardTodoXp(user.uid, id, taskXpReward);
    }
  };

  const removeTodo = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await deleteFromFirestore(id);
  };

  return { todos, addTodo, toggleTodo, removeTodo };
}
