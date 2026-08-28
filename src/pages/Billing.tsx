import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerStep from "../components/billing/CustomerStep";
import ProductList from "../components/billing/ProductList";
import CartPanel from "../components/billing/CartPanel";
import OrderSummary from "../components/billing/OrderSummary";
import PaymentForm from "../components/billing/PaymentForm";
import { createOrder, recordPayment } from "../api/orders";
import type { Customer, CartItem, Product, OrderResponse, PaymentResponse } from "../types/billing";

type Step = "customer" | "cart" | "summary" | "payment" | "done";

export default function Billing() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("customer");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productID === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productID === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { productID: product.id, title: product.title, unit: product.unit, price: product.price, quantity: 1 },
      ];
    });
  };

  const handleIncrease = (productID: number) => {
    setCart((prev) =>
      prev.map((item) => (item.productID === productID ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecrease = (productID: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.productID === productID ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (productID: number) => {
    setCart((prev) => prev.filter((item) => item.productID !== productID));
  };

  const handleCreateOrder = async () => {
    if (!customer) return;
    setCreatingOrder(true);
    setError("");
    try {
      const created = await createOrder({
        customerID: customer.ID,
        items: cart.map((item) => ({
          productID: item.productID,
          unit: item.unit,
          quantity: item.quantity,
        })),
      });
      setOrder(created);
      setStep("summary");
    } catch {
      setError("Could not create order.");
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleSubmitPayment = async (payload: {
    paymentMethod: string;
    tenderedAmount: number;
    changeGiven: number;
    payPreviousCredit: boolean;
    payThroughCredit: boolean;
  }) => {
    if (!order) return;
    setSubmittingPayment(true);
    setError("");
    try {
      const result = await recordPayment(order.ID, payload);
      setPayment(result);
      setStep("done");
    } catch {
      setError("Payment failed.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-stone-500 hover:text-stone-700 text-sm mb-6 inline-block"
        >
          ← Back to Home
        </button>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {step === "customer" && (
          <CustomerStep
            onCustomerFound={(c) => {
              setCustomer(c);
              setStep("cart");
            }}
          />
        )}

        {step === "cart" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ProductList onAddToCart={handleAddToCart} />
            </div>
            <div>
              <CartPanel
                items={cart}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
                onCreateOrder={handleCreateOrder}
                creatingOrder={creatingOrder}
              />
            </div>
          </div>
        )}

        {step === "summary" && order && (
          <OrderSummary order={order} onProceedToPayment={() => setStep("payment")} />
        )}

        {step === "payment" && order && customer && (
          <PaymentForm order={order} customer={customer} onSubmit={handleSubmitPayment} submitting={submittingPayment} />
        )}

        {step === "done" && payment && (
          <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-8 py-10 max-w-md mx-auto text-center">
            <h2 className="font-fraunces text-2xl text-stone-800 mb-4">Order Complete</h2>
            <p className="text-stone-600 mb-1">Change given: ₹{payment.ChangeGiven.toFixed(2)}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
