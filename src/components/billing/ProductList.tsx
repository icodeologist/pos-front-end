import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";
import type { Product } from "../../types/billing";

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductList({ onAddToCart }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-stone-500">Loading products...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-5 py-4 flex justify-between items-center"
        >
          <div>
            <p className="text-stone-800 font-medium">{product.title}</p>
            <p className="text-stone-500 text-sm">
              ₹{product.price.toFixed(2)} / {product.unit}
            </p>
            <p className="text-stone-400 text-xs mt-1">Stock: {product.stockQuantity}</p>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stockQuantity <= 0}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
