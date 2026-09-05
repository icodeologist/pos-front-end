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
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <button
          onClick={() => navigate("/products")}
          className="mb-6 inline-block text-sm font-bold text-slate-500 hover:text-orange-500"
        >
          ← Back to Products
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">Inventory</p><h1 className="mb-2 text-2xl font-extrabold text-slate-900">New Product</h1><p className="mb-7 text-sm text-slate-500">Add a product to your POS catalogue.</p>

          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />

          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />

          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          >
            <option value="kg">kg</option>
            <option value="pcs">pcs</option>
            <option value="dozen">dozen</option>
            <option value="box">box</option>
          </select>

          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />

          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Stock Quantity</label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full whitespace-nowrap rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
