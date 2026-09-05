import { Navigate, useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";

export default function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated } = useRole();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Welcome to AvinsMart</h1>
        <p className="mx-auto mt-4 max-w-md text-slate-500">Sign in to open your store workspace.</p>
        <button onClick={() => navigate("/login")} className="mt-8 rounded-xl bg-orange-500 px-8 py-3.5 font-bold text-white hover:bg-orange-600">Log in</button>
      </div>
    </main>
  );
}
