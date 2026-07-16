import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth/auth";
import { loadTasks } from "../tasks/taskStore";

export default function Reports() {
  const navigate = useNavigate();

  const user = getUser();
  const email = user?.email ?? "";

  const tasks = useMemo(() => {
    if (!email) return [];
    return loadTasks(email);
  }, [email]);

  const total = tasks.length;
  const todo = tasks.filter((task) => task.status === "todo").length;
  const doing = tasks.filter((task) => task.status === "doing").length;
  const done = tasks.filter((task) => task.status === "done").length;

  const overdue = tasks.filter((task) => {
    if (!task.dueDate || task.status === "done") return false;

    const dueDate = new Date(`${task.dueDate}T23:59:59`);
    return dueDate.getTime() < Date.now();
  }).length;

  const completionRate =
    total === 0 ? 0 : Math.round((done / total) * 100);

  const reportCards = [
    {
      title: "Total tasks",
      value: total,
      description: "All tasks",
    },
    {
      title: "Todo",
      value: todo,
      description: "Not started",
    },
    {
      title: "Doing",
      value: doing,
      description: "In progress",
    },
    {
      title: "Done",
      value: done,
      description: "Completed",
    },
    {
      title: "Overdue",
      value: overdue,
      description: "Past due date",
    },
    {
      title: "Completion rate",
      value: `${completionRate}%`,
      description: "Tasks completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white/20 p-6 text-white shadow-xl backdrop-blur-lg">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-5 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30"
          >
            ← Dashboard
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Reports</h2>
              <p className="text-sm text-white/80">
                Task statistics for {email}
              </p>
            </div>

            <div className="rounded-full bg-white/20 px-4 py-2 text-sm">
              Total: {total}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl bg-white p-6 shadow-lg"
            >
              <p className="text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <p className="mt-3 text-4xl font-bold text-slate-900">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Completion progress
              </h3>
              <p className="text-sm text-slate-500">
                {done} of {total} tasks completed
              </p>
            </div>

            <span className="text-lg font-bold text-purple-600">
              {completionRate}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}