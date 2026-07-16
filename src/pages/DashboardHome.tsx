import { Link } from "react-router-dom";

function Card({
  title,
  desc,
  to,
}: {
  title: string;
  desc: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-slate-500">{desc}</p>
    </Link>
  );
}

export default function DashboardHome() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card
        title="Tasks"
        desc="To-Do / Doing / Done"
        to="/dashboard/tasks"
      />

      <Card
        title="Users"
        desc="Coming soon"
        to="/dashboard"
      />

      <Card
        title="Reports"
        desc="Task statistics and progress"
        to="/dashboard/reports"
      />
    </div>
  );
}