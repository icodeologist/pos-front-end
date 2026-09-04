import { useState } from "react";
import axios from "axios";
import { getCustomerByPhone, registerCustomer } from "../../api/customer";
import type { Customer } from "../../types/billing";

interface CustomerStepProps {
  onCustomerFound: (customer: Customer) => void;
}

type Stage = "enter-phone" | "not-found" | "found";

export default function CustomerStep({ onCustomerFound }: CustomerStepProps) {
  const [stage, setStage] = useState<Stage>("enter-phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    try {
      const found = await getCustomerByPhone(phone);
      setCustomer(found);
      setStage("found");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setStage("not-found");
      } else {
        setError("Something went wrong looking up the customer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const created = await registerCustomer({ name, phone_number: phone });
      setCustomer(created);
      setStage("found");
    } catch {
      setError("Could not register customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-8 py-10 max-w-md mx-auto">
      <p className="text-sm uppercase tracking-wide text-stone-400 mb-2">Step 1</p>
      <h2 className="font-fraunces text-2xl text-stone-800 mb-6">Find Customer</h2>

      {stage === "enter-phone" && (
        <>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Looking up..." : "Look Up Customer"}
          </button>
        </>
      )}

      {stage === "not-found" && (
        <>
          <p className="text-stone-500 mb-4">No customer found for {phone}. Register them below.</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register & Continue"}
          </button>
        </>
      )}

      {stage === "found" && customer && (
        <>
          <div className="bg-stone-50 rounded-lg p-4 mb-4">
            <p className="text-stone-800 font-medium">{customer.name}</p>
            <p className="text-stone-500 text-sm">{customer.phone_number}</p>
            <p className="text-stone-500 text-sm mt-1">
              Credit balance: ₹{customer.balance.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => onCustomerFound(customer)}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Continue to Products
          </button>
        </>
      )}

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
    </div>
  );
}
