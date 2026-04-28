import { useEffect, useMemo, useState } from "react";
import { loadTasks, saveTasks } from "../tasks/taskStore";
import type { Task, TaskStatus, TaskPriority } from "../tasks/taskStore";
import { getUser } from "../auth/auth";

const columns: { key: TaskStatus; title: string }[] = [
  { key: "todo", title: "Todo" },
  { key: "doing", title: "Doing" },
  { key: "done", title: "Done" },
];

const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-red-100 text-red-700 border-red-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  low: "bg-green-100 text-green-700 border-green-300",
};

function uid() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    String(Date.now()) + Math.random().toString(16).slice(2)
  );
}

function isOverdue(task: Task) {
  if (!task.dueDate) return false;
  return new Date(task.dueDate).getTime() < Date.now() && task.status !== "done";
}

export default function Tasks() {
  const user = getUser();
  const email = user?.email ?? "";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [editDueDate, setEditDueDate] = useState("");

  useEffect(() => {
    if (!email) return;
    setTasks(loadTasks(email));
    setLoaded(true);
  }, [email]);

  useEffect(() => {
    if (!loaded || !email) return;
    saveTasks(email, tasks);
  }, [tasks, loaded, email]);

  const byStatus = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === "todo"),
      doing: tasks.filter((t) => t.status === "doing"),
      done: tasks.filter((t) => t.status === "done"),
    };
  }, [tasks]);

  const addTask = () => {
    const t = title.trim();
    if (!t) return;

    setTasks((prev) => [
      {
        id: uid(),
        title: t,
        status: "todo",
        priority,
        dueDate: dueDate || undefined,
        createdAt: Date.now(),
      },
      ...prev,
    ]);

    setTitle("");
    setPriority("medium");
    setDueDate("");
  };

  const deleteTask = (id: string) => {
    if (!confirm("Delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditPriority("medium");
    setEditDueDate("");
  };

  const saveEdit = (id: string) => {
    const newTitle = editTitle.trim();
    if (!newTitle) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: newTitle,
              priority: editPriority,
              dueDate: editDueDate || undefined,
            }
          : t
      )
    );

    cancelEdit();
  };

  const changeStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const onDrop = (status: TaskStatus) => {
    if (!draggingId) return;
    changeStatus(draggingId, status);
    setDraggingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white/20 p-6 shadow-xl backdrop-blur-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold">Task Board</h2>
              <p className="text-sm text-white/80">Owner: {email}</p>
            </div>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Total: {tasks.length}
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-3">
            <input
              className="rounded-xl px-3 py-2 text-black md:col-span-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New task..."
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />

            <select
              className="rounded-xl px-3 py-2 text-black"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <input
              type="date"
              className="rounded-xl px-3 py-2 text-black"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button
              onClick={addTask}
              className="bg-black text-white rounded-xl py-2 md:col-span-4"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(col.key)}
              className="bg-white/20 p-4 rounded-3xl backdrop-blur-lg min-h-[360px]"
            >
              <h3 className="text-white font-bold text-lg mb-3">{col.title}</h3>

              {byStatus[col.key].map((task) => (
                <div
                  key={task.id}
                  draggable={editingId !== task.id}
                  onDragStart={() => setDraggingId(task.id)}
                  className={`bg-white p-4 rounded-2xl shadow mb-3 cursor-move ${
                    isOverdue(task) ? "border border-red-400" : ""
                  }`}
                >
                  {editingId === task.id ? (
                    <div className="space-y-2">
                      <input
                        className="w-full rounded-xl border px-3 py-2 text-base font-semibold"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Task title"
                      />

                      <select
                        className="w-full rounded-xl border px-3 py-2"
                        value={editPriority}
                        onChange={(e) =>
                          setEditPriority(e.target.value as TaskPriority)
                        }
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>

                      <input
                        type="date"
                        className="w-full rounded-xl border px-3 py-2"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                        >
                          Save
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between gap-3">
                        <p className="text-lg font-bold text-slate-900 leading-snug">
                          {task.title}
                        </p>

                        <span
                          className={`shrink-0 text-xs border rounded-lg px-2 py-1 h-fit ${
                            priorityStyles[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.dueDate && (
                        <p
                          className={`mt-2 text-sm font-semibold ${
                            task.status === "done"
                              ? "text-green-600"
                              : isOverdue(task)
                              ? "text-red-600"
                              : "text-slate-700"
                          }`}
                        >
                          Due: {task.dueDate}
                          {task.status === "done"
                            ? " • Completed"
                            : isOverdue(task)
                            ? " • Overdue"
                            : ""}
                        </p>
                      )}

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => startEdit(task)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {byStatus[col.key].length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/50 p-4 text-center text-sm text-white/80">
                  Drag tasks here
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}