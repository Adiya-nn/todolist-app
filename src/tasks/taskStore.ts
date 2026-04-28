// src/tasks/taskStore.ts

export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  createdAt: number;
};

function keyFor(email: string) {
  const safe = email.trim().toLowerCase();
  return `tasks_v2_${safe}`;   // ✅ FIXED
}

export function loadTasks(email: string): Task[] {
  const raw = localStorage.getItem(keyFor(email));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Task[];
    return parsed.map((t) => ({
      ...t,
      priority: (t as any).priority ?? "medium",
    }));
  } catch {
    return [];
  }
}

export function saveTasks(email: string, tasks: Task[]) {
  localStorage.setItem(keyFor(email), JSON.stringify(tasks));
}
