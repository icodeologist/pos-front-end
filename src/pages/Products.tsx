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

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-stone-500 hover:text-stone-700 text-sm mb-6 inline-block"
        >
          ← Back to Home
        </button>

        <h1 className="font-fraunces text-2xl text-stone-800 mb-6">Products</h1>

        {loading && <p className="text-stone-500">Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
