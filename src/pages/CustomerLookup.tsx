import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCustomerByPhone, registerCustomer } from "../api/customer";
import type { Customer } from "../api/customer";

export default function CustomerLookup() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  // Three possible states for what's on screen:
  // "enter-phone" -> "not-found" (show register form) -> "found" (ready to order)
  const [stage, setStage] = useState<"enter-phone" | "not-found" | "found">(
    "enter-phone"
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [message, setMessage] = useState("");

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const found = await getCustomerByPhone(phone);
      setCustomer(found);
      setStage("found");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Expected case — not an error, just means "register them"
        setStage("not-found");
      } else {
        setMessage("Something went wrong looking up this number.");
      }
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const created = await registerCustomer({ name, phone_number: phone });
      setCustomer(created);
      setStage("found");
    } catch (err: unknown) {
      setMessage(`Failed: ${axios.isAxiosError(err) ? err.response?.data ?? "unknown error" : "unknown error"}`);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <button onClick={() => navigate("/")} className="mb-8 flex items-center gap-3 text-left"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 font-extrabold text-white shadow-lg shadow-orange-200">A</span><span><span className="block font-extrabold text-slate-900">AvinsMart</span><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Suite</span></span></button><p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">
          New Order
        </p>
        <h1
          className="mb-2 text-2xl font-extrabold text-slate-900"
        >
          Customer Lookup
        </h1><p className="mb-7 text-sm text-slate-500">Find an account or register a new customer.</p>

        {stage === "enter-phone" && (
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </div>
            <button
              type="submit"
              className="w-full whitespace-nowrap rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600"
            >
              Find Customer
            </button>
          </form>
        )}

        {stage === "not-found" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
              No customer found for {phone}. Register them below.
            </p>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </div>
            <button
              type="submit"
              className="w-full whitespace-nowrap rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600"
            >
              Register & Continue
            </button>
          </form>
        )}

        {stage === "found" && customer && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-extrabold text-slate-900">{customer.name}</p>
            <p className="mt-1 font-mono text-sm text-slate-500">{customer.phone_number}</p>
            {customer.balance > 0 && (
              <p className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                Owes ₹{customer.balance.toFixed(2)} in credit
              </p>
            )}
            <button onClick={() => navigate("/billing")} className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-orange-500">Continue to POS</button>
          </div>
        )}

        {message && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
