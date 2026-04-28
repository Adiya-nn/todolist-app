import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../auth/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!email || !password) {
      setError("Email болон password-оо бөглөнө үү");
      return false;
    }

    if (password.length < 6) {
      setError("Password дор хаяж 6 тэмдэгт байх ёстой");
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await login(email, password);

      if (!res.ok) {
        setError(res.error);
        return;
      }

      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await register(email, password);

      if (!res.ok) {
        setError(res.error);
        return;
      }

      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-10">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome</h1>
          <p className="text-sm text-slate-600">
            Sign in or create an account
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <p className="text-xs text-slate-500">
            * Password дор хаяж 6 тэмдэгт
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Sign in"}
        </button>

        <button
          type="button"
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Create account (Register)"}
        </button>

        <div className="text-center text-xs text-slate-600">
          Register хийсний дараа Firebase Console → Authentication → Users дээр хэрэглэгч харагдана.
        </div>
      </form>
    </div>
  );
}
