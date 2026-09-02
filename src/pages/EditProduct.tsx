import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getProducts, updateProduct } from "../api/products";
import type { Product } from "../types/billing";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const passedProduct = (location.state as { product?: Product } | null)?.product;

  const [product, setProduct] = useState<Product | null>(passedProduct ?? null);
  const [title, setTitle] = useState(passedProduct?.title ?? "");
  const [price, setPrice] = useState(passedProduct?.price?.toString() ?? "");
  const [stockQuantity, setStockQuantity] = useState(
    passedProduct?.stockQuantity?.toString() ?? ""
  );
  const [loading, setLoading] = useState(!passedProduct);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // No GET /products/{id} endpoint exists yet — if we weren't handed the
  // product via navigation state (e.g. page was refreshed), fall back to
  // fetching the full list and finding it by id.
  useEffect(() => {
    if (passedProduct || !id) return;
    getProducts()
      .then((all) => {
        const found = all.find((p) => p.id === Number(id));
        if (!found) {
          setError("Product not found.");
          return;
        }
        setProduct(found);
        setTitle(found.title);
        setPrice(found.price.toString());
        setStockQuantity(found.stockQuantity.toString());
      })
      .catch(() => setError("Could not load product."))
      .finally(() => setLoading(false));
  }, [id, passedProduct]);

  const handleSubmit = async () => {
    if (!product) return;
    setSubmitting(true);
    setError("");
    try {
      await updateProduct(product.id, {
        title: title.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
        stock: stockQuantity ? parseInt(stockQuantity) : undefined,
      });
      navigate("/products");
    } catch {
      setError("Could not update product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-stone-500 p-10">Loading...</p>;
  if (error && !product) return <p className="text-red-600 p-10">{error}</p>;
  if (!product) return null;

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
          <h1 className="font-fraunces text-2xl text-stone-800 mb-6">
            Edit {product.title}
          </h1>

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
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
