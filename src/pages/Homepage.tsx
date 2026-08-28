import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-8 py-10">
          <p className="text-sm uppercase tracking-wide text-stone-400 mb-2">
            Dashboard
          </p>
          <h1 className="font-fraunces text-3xl text-stone-800 mb-1">
            Poultry Shop
          </h1>
          <p className="text-stone-500 mb-8">
            Manage orders and customer billing
          </p>

          <button
            onClick={() => navigate("/billing")}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors"
          >
            + New Order
          </button>
        </div>
      </div>
    </div>
  );
}
