import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/products";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [taxRate, setTaxRate] = useState("0");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !price) {
      setError("Title and price are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createProduct({
        title: title.trim(),
        price: parseFloat(price),
        unit,
        taxRate: parseFloat(taxRate) || 0,
        stockQuantity: parseInt(stockQuantity) || 0,
      });
      navigate("/products");
    } catch {
      setError("Could not create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate("/products")}
          className="text-stone-500 hover:text-stone-700 text-sm mb-6 inline-block"
        >
          ← Back to Products
        </button>

        <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-8 py-10">
          <h1 className="font-fraunces text-2xl text-stone-800 mb-6">New Product</h1>

          <label className="block text-sm text-stone-600 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <label className="block text-sm text-stone-600 mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <label className="block text-sm text-stone-600 mb-1">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="kg">kg</option>
            <option value="pcs">pcs</option>
            <option value="dozen">dozen</option>
            <option value="box">box</option>
          </select>

          <label className="block text-sm text-stone-600 mb-1">Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <label className="block text-sm text-stone-600 mb-1">Stock Quantity</label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
