import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { loginAdmin, loginStaff } from "../api/admin";
import { useRole } from "../context/RoleContext";
import type { Role } from "../types/dashboard";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useRole();
  const [role, setRole] = useState<Role>("staff");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const login = role === "admin" ? loginAdmin : loginStaff;
      await login({ email: email.trim(), password });
      signIn(role);
      navigate("/dashboard", { replace: true });
    } catch (caught: unknown) {
      const responseMessage = axios.isAxiosError(caught) ? caught.response?.data : null;
      setError(typeof responseMessage === "string" ? responseMessage : "Email or password is incorrect.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
        <button onClick={() => navigate("/")} className="mb-8 text-sm font-bold text-slate-400 hover:text-orange-500">← Welcome</button>
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">AvinsMart</p>
        <h1 className="text-3xl font-extrabold text-slate-900">Log in</h1>
        <p className="mb-7 mt-2 text-sm text-slate-500">Use your store account to continue.</p>
        <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          {(["staff", "admin"] as Role[]).map((option) => <button key={option} type="button" onClick={() => setRole(option)} className={`rounded-lg px-4 py-2.5 text-sm font-bold capitalize transition ${role === option ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>{option}</button>)}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</label><input id="email" required autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100" /></div>
          <div><label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label><input id="password" required autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100" /></div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}
          <button disabled={submitting} type="submit" className="w-full rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 disabled:opacity-50">{submitting ? "Logging in..." : `Log in as ${role}`}</button>
        </form>
        <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-400">
          Access is restricted to approved AvinsMart staff. If you need an account, please contact your administrator or the developer—outside registrations are not accepted.
        </p>
        <p className="mt-3 text-center text-[11px] font-semibold tracking-wide text-slate-300">
          Developed by icodeologist
        </p>
      </div>
    </main>
  );
}
