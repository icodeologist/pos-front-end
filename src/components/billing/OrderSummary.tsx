import type { OrderResponse } from "../../types/billing";

interface OrderSummaryProps {
  order: OrderResponse;
  onProceedToPayment: () => void;
}

export default function OrderSummary({ order, onProceedToPayment }: OrderSummaryProps) {
  return (
    <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-8 py-10 max-w-md mx-auto">
      <p className="text-sm uppercase tracking-wide text-stone-400 mb-2">Step 3</p>
      <h2 className="font-fraunces text-2xl text-stone-800 mb-6">Order Created</h2>

      <div className="bg-stone-50 rounded-lg p-4 mb-6 space-y-1">
        <p className="text-stone-800">Order #{order.ID}</p>
        <p className="text-stone-500 text-sm">Status: {order.Status}</p>
        <p className="text-stone-500 text-sm">Items: {order.OrderItems?.length ?? 0}</p>
        <p className="text-stone-800 font-medium mt-2">
          Total: ₹{order.TotalAmount.toFixed(2)}
        </p>
      </div>

      <button
        onClick={onProceedToPayment}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
