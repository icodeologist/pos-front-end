import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import type { Product } from "../types/billing";
import ProductCard from "../components/products/ProductCard";
import CreateProductCard from "../components/products/CreateProductCard";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = () => {
    setLoading(true);
    setError("");
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products from the backend."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products from the backend."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-500"
        >
          ← Back to Home
        </button>

        <div className="mb-7 flex items-end justify-between"><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">Inventory</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Products</h1><p className="mt-1 text-sm text-slate-500">Manage pricing, units and available stock.</p></div><button onClick={() => navigate("/products/new")} className="whitespace-nowrap rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600">+ New Product</button></div>

        {loading && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-400 shadow-sm">Loading products...</div>}
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-600"><p>{error}</p><button onClick={loadProducts} className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-700">Try again</button></div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <CreateProductCard onClick={() => navigate("/products/new")} />
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
