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
    const payload = {
      title: title.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
      stock: stockQuantity ? parseInt(stockQuantity) : undefined,
    };
    console.log("SENDING PATCH:", payload);
    try {
      const result = await updateProduct(product.id, payload);
      console.log("PATCH RESPONSE:", result);
      navigate("/products");
    } catch (err) {
      console.log("PATCH ERROR:", err);
      setError("Could not update product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-100 p-10 text-slate-500">Loading...</div>;
  if (error && !product) return <div className="min-h-screen bg-slate-100 p-10 text-red-600">{error}</div>;
  if (!product) return null;

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
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">Inventory</p><h1 className="mb-7 text-2xl font-extrabold text-slate-900">
            Edit {product.title}
          </h1>

          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />

          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
