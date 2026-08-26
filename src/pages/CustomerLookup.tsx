import { useState } from "react";
import { getCustomerByPhone, registerCustomer } from "../api/customer";
import type { Customer } from "../api/customer";

export default function CustomerLookup() {
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
    } catch (err: any) {
      if (err.response?.status === 404) {
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
    } catch (err: any) {
      setMessage(`Failed: ${err.response?.data ?? "unknown error"}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 border-l-4 border-l-emerald-800 rounded-sm shadow-sm p-8">
        <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-1">
          New Order
        </p>
        <h1
          className="text-2xl font-semibold text-stone-900 mb-6"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Customer Lookup
        </h1>

        {stage === "enter-phone" && (
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="w-full border border-stone-300 rounded-sm px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-800 text-white py-2.5 rounded-sm font-medium hover:bg-emerald-900 transition-colors"
            >
              Find Customer
            </button>
          </form>
        )}

        {stage === "not-found" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <p className="text-sm text-stone-500">
              No customer found for {phone}. Register them below.
            </p>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-stone-300 rounded-sm px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-800 text-white py-2.5 rounded-sm font-medium hover:bg-emerald-900 transition-colors"
            >
              Register & Continue
            </button>
          </form>
        )}

        {stage === "found" && customer && (
          <div>
            <p className="text-stone-900 font-medium">{customer.name}</p>
            <p className="text-sm text-stone-500">{customer.phone_number}</p>
            {customer.balance > 0 && (
              <p className="text-sm text-amber-700 mt-2">
                Owes ₹{customer.balance.toFixed(2)} in credit
              </p>
            )}
            {/* Next step: hand `customer` off to the order-taking flow */}
          </div>
        )}

        {message && (
          <p className="mt-4 text-sm text-stone-600 border-t border-stone-100 pt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
