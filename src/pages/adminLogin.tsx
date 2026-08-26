import { useState } from "react";
import { loginAdmin } from "../api/admin";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await loginAdmin({ email, password });
      setMessage("Logged in.");
    } catch (err: any) {
      setMessage(`Failed: ${err.response?.data ?? "unknown error"}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 border-l-4 border-l-emerald-800 rounded-sm shadow-sm p-8">
        <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-1">
          Admin Access
        </p>
        <h1 className="text-2xl font-semibold text-stone-900 mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-300 rounded-sm px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-300 rounded-sm px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 text-white py-2.5 rounded-sm font-medium hover:bg-emerald-900 transition-colors"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-stone-600 border-t border-stone-100 pt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
