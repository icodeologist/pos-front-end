import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/billing";
import { useRole } from "../../context/RoleContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { role } = useRole();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-3"><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">{product.unit}</span><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${product.stockQuantity < 10 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{product.stockQuantity < 10 ? "Low stock" : "In stock"}</span></div>
      <p className="mb-2 min-h-12 font-extrabold leading-6 text-slate-900">{product.title}</p>
      <p className="mb-1 font-mono text-xl font-bold text-slate-900">
        ₹{product.price.toFixed(2)} / {product.unit}
      </p>
      <p className="mb-4 text-xs font-semibold text-slate-400">
        Stock: {product.stockQuantity} {product.unit}
      </p>

      {role === "admin" && (
        <button
          onClick={() =>
            navigate(`/products/edit/${product.id}`, { state: { product } })
          }
          className="w-full whitespace-nowrap rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
        >
          Edit
        </button>
      )}
    </div>
  );
}
