import { useEffect, useState } from "react";
import TaskProgressBar from "./ui/TaskProgressBar";
import Plus from "./ui/Plus";
import Trash from "./ui/Trash";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const Tasks = () => {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const completedTask = tasks.filter((t) => t.done).length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedTask / tasks.length) * 100);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="bg-(--lf-card) h-full rounded-xl p-6">
      <div className="flex flex-col gap-5">
        <p className="text-(--lf-primary) font-medium">Tasks</p>
        <div className="flex flex-col gap-3">
          <TaskProgressBar progress={progress} />
          <div>
            <form
              className="flex gap-2 items-center p-1 rounded-xl border border-(--lf-border) bg-(--lf-bg) focus-within:ring-2 focus-within:ring-(--lf-accent)/40 transition-all duration-200"
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim()) return;

                setTasks([
                  ...tasks,
                  {
                    id: Date.now(),
                    title: input,
                    done: false,
                  },
                ]);
              }}
            >
              <input
                className="px-3 py-1.5 bg-transparent text-(--lf-primary) placeholder:text-(--lf-primary)/40 text-sm w-full outline-none"
                placeholder="Add a new task..."
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-(--lf-accent) hover:opacity-90 active:scale-95 text-white text-sm font-medium rounded-lg px-3 py-1.5 transition-all duration-150 shrink-0"
              >
                <Plus size={15} />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>
        <ul className="flex flex-col gap-3 px-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex gap-2 items-center justify-between"
            >
              <div className="flex gap-2 items-center">
                <input
                  className="accent-(--lf-accent) scale-130 cursor-pointer"
                  type="checkbox"
                  checked={task.done}
                  onChange={() => {
                    setTasks(
                      tasks.map((t) =>
                        t.id === task.id ? { ...t, done: !t.done } : t,
                      ),
                    );
                  }}
                />
                <p
                  className={`text-(--lf-primary) text-sm ${task.done ? "line-through opacity-50" : ""}`}
                >
                  {task.title}
                </p>
              </div>
              <button
                onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                className="text-(--lf-primary) opacity-40 hover:opacity-100 hover:text-red-500 transition-all duration-150 cursor-pointer shrink-0"
              >
                <Trash size={17} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
