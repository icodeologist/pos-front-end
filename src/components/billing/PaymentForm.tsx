import { useState } from "react";
import type { Customer, OrderResponse } from "../../types/billing";

interface PaymentFormProps {
  order: OrderResponse;
  customer: Customer;
  onSubmit: (payload: {
    paymentMethod: string;
    tenderedAmount: number;
    changeGiven: number;
    payPreviousCredit: boolean;
    payThroughCredit: boolean;
  }) => void;
  submitting: boolean;
}

export default function PaymentForm({ order, customer, onSubmit, submitting }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [tenderedAmount, setTenderedAmount] = useState("");
  const [payPreviousCredit, setPayPreviousCredit] = useState(false);
  const [payThroughCredit, setPayThroughCredit] = useState(false);

  const tendered = parseFloat(tenderedAmount) || 0;
  const excess = Math.max(tendered - order.TotalAmount, 0);
  const shortfall = Math.max(order.TotalAmount - tendered, 0);
  const hasExistingCredit = customer.balance > 0;

  const handleSubmit = () => {
    onSubmit({
      paymentMethod,
      tenderedAmount: payThroughCredit ? 0 : tendered,
      changeGiven: payThroughCredit ? 0 : excess,
      payPreviousCredit,
      payThroughCredit,
    });
  };

  return (
    <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-8 py-10 max-w-md mx-auto">
      <p className="text-sm uppercase tracking-wide text-stone-400 mb-2">Step 4</p>
      <h2 className="font-fraunces text-2xl text-stone-800 mb-6">Payment</h2>

      <div className="bg-stone-50 rounded-lg p-4 mb-6 text-sm text-stone-600">
        <p>Amount due: ₹{order.TotalAmount.toFixed(2)}</p>
        {hasExistingCredit && <p>Existing credit owed: ₹{customer.balance.toFixed(2)}</p>}
      </div>

      <label className="block mb-4">
        <input
          type="checkbox"
          checked={payThroughCredit}
          onChange={(e) => setPayThroughCredit(e.target.checked)}
          className="mr-2"
        />
        Charge entire order to customer credit
      </label>

      {!payThroughCredit && (
        <>
          <label className="block text-sm text-stone-600 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <label className="block text-sm text-stone-600 mb-1">Tendered Amount</label>
          <input
            type="number"
            value={tenderedAmount}
            onChange={(e) => setTenderedAmount(e.target.value)}
            placeholder="0.00"
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          {shortfall > 0 && tendered > 0 && (
            <p className="text-amber-600 text-sm mb-4">
              Shortfall of ₹{shortfall.toFixed(2)} will be added to customer credit.
            </p>
          )}

          {excess > 0 && hasExistingCredit && (
            <label className="block mb-4">
              <input
                type="checkbox"
                checked={payPreviousCredit}
                onChange={(e) => setPayPreviousCredit(e.target.checked)}
                className="mr-2"
              />
              Use excess (₹{excess.toFixed(2)}) to pay down existing credit
            </label>
          )}
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || (!payThroughCredit && tendered <= 0)}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Processing..." : "Finalize Payment"}
      </button>
    </div>
  );
}
