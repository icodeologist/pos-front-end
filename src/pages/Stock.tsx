import { useEffect, useMemo, useState } from "react";
import { getProducts, updateStock } from "../api/products";
import type { Product } from "../types/billing";

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setQuantities(Object.fromEntries(data.map((product) => [product.id, String(product.stockQuantity)])));
      })
      .catch(() => setError("Could not load stock from the backend."))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((product) => product.title.toLowerCase().includes(query.trim().toLowerCase())),
    [products, query]
  );

  const save = async (product: Product) => {
    const quantity = Number(quantities[product.id]);
    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Stock quantity must be a whole number of zero or more.");
      return;
    }

    setSavingId(product.id);
    setError("");
    setMessage("");
    try {
      const updated = await updateStock(product.id, { stockQuantity: quantity });
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, ...updated, stockQuantity: quantity } : item));
      setMessage(`${product.title} stock updated.`);
    } catch {
      setError("Could not update stock. Check that you are signed in as an admin or staff user.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">Inventory</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Stock</h1>
            <p className="mt-1 text-sm text-slate-500">Update available quantities without changing product details or prices.</p>
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">{error}</p>}
        {message && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{message}</p>}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-400">Loading stock...</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-b-0 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold text-slate-900">{product.title}</p>
                  <p className={`mt-1 text-xs font-bold ${product.stockQuantity < 10 ? "text-amber-600" : "text-slate-400"}`}>Current: {product.stockQuantity} {product.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    aria-label={`Stock quantity for ${product.title}`}
                    type="number"
                    min="0"
                    step="1"
                    value={quantities[product.id] ?? ""}
                    onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: event.target.value }))}
                    className="w-28 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-orange-300"
                  />
                  <span className="w-10 text-xs font-semibold text-slate-400">{product.unit}</span>
                  <button
                    onClick={() => save(product)}
                    disabled={savingId === product.id || quantities[product.id] === String(product.stockQuantity)}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {savingId === product.id ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ))}
            {!filteredProducts.length && <p className="p-8 text-center text-sm text-slate-400">No products found.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
