import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/admin";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await loginAdmin({ email, password });
      setMessage("Logged in.");
      navigate("/");
    } catch (err: unknown) {
      setMessage(`Failed: ${axios.isAxiosError(err) ? err.response?.data ?? "unknown error" : "unknown error"}`);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 font-extrabold text-white shadow-lg shadow-orange-200">N</span><div><p className="font-extrabold text-slate-900">NexaPOS</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Suite</p></div></div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">
          Admin Access
        </p>
        <h1 className="mb-2 text-2xl font-extrabold text-slate-900">
          Admin Login
        </h1><p className="mb-7 text-sm text-slate-500">Sign in to manage your store and counter.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            className="w-full whitespace-nowrap rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
