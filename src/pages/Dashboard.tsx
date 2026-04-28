import { Outlet, useNavigate } from "react-router-dom";
import { logout, getUser } from "../auth/auth";
import { useEffect, useState } from "react";

// 🔥 Firestore
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

// 👉 ЧИНИЙ ADMIN EMAIL
const ADMIN_EMAIL = "aayaqn137@gmail.com";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [userCount, setUserCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // 🔥 USERS COUNT авах
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        setUserCount(snapshot.size);
      } catch (err) {
        console.error("USER COUNT ERROR:", err);
      }
    };

    // 👉 зөвхөн admin үед л fetch хийнэ
    if (user?.email === ADMIN_EMAIL) {
      fetchUsers();
    }
  }, [user]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-500">User: {user?.email}</p>

            {/* 🔥 ADMIN ONLY */}
            {isAdmin && (
              <p className="mt-2 text-sm text-blue-600 font-semibold">
                Total users: {userCount}
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-5 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}