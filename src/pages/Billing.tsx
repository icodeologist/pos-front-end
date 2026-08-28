import { useNavigate } from "react-router-dom";

export default function Billing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-stone-500 hover:text-stone-700 text-sm mb-6 inline-block"
        >
          ← Back to Home
        </button>

        <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-8 py-10">
          <p className="text-sm uppercase tracking-wide text-stone-400 mb-2">
            New Order
          </p>
          <h1 className="font-fraunces text-3xl text-stone-800 mb-1">
            Billing
          </h1>
          <p className="text-stone-500">
            Product list, cart, and checkout will go here.
          </p>
        </div>
      </div>
    </div>
  );
}
