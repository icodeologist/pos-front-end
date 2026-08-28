import type { CartItem } from "../../types/billing";

interface CartPanelProps {
  items: CartItem[];
  onIncrease: (productID: number) => void;
  onDecrease: (productID: number) => void;
  onRemove: (productID: number) => void;
  onCreateOrder: () => void;
  creatingOrder: boolean;
}

export default function CartPanel({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onCreateOrder,
  creatingOrder,
}: CartPanelProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-6 py-6 sticky top-6">
      <h3 className="font-fraunces text-xl text-stone-800 mb-4">Cart</h3>

      {items.length === 0 ? (
        <p className="text-stone-400 text-sm">No items yet.</p>
      ) : (
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.productID} className="flex justify-between items-center text-sm">
              <div>
                <p className="text-stone-800">{item.title}</p>
                <p className="text-stone-400">
                  ₹{item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDecrease(item.productID)}
                  className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                >
                  −
                </button>
                <span className="w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => onIncrease(item.productID)}
                  className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                >
                  +
                </button>
                <button
                  onClick={() => onRemove(item.productID)}
                  className="text-red-500 hover:text-red-700 text-xs ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-stone-200 pt-4 mb-4 flex justify-between font-medium text-stone-800">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      <button
        onClick={onCreateOrder}
        disabled={items.length === 0 || creatingOrder}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {creatingOrder ? "Creating Order..." : "Create Order"}
      </button>
    </div>
  );
}
