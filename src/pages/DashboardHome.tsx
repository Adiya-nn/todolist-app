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
      className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition block"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-slate-500">{desc}</p>
    </Link>
  );
}

export default function DashboardHome() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Tasks" desc="To-Do / Doing / Done" to="/dashboard/tasks" />
      <Card title="Users" desc="Энд функц нэмнэ" to="#" />
      <Card title="Reports" desc="Энд функц нэмнэ" to="#" />
    </div>
  );
}
