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
    <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-5 py-5">
      <p className="text-stone-800 font-medium mb-1">{product.title}</p>
      <p className="text-stone-500 text-sm mb-1">
        ₹{product.price.toFixed(2)} / {product.unit}
      </p>
      <p className="text-stone-400 text-xs mb-3">
        Stock: {product.stockQuantity} {product.unit}
      </p>

      {role === "admin" && (
        <button
          onClick={() =>
            navigate(`/products/edit/${product.id}`, { state: { product } })
          }
          className="text-emerald-700 hover:text-emerald-800 text-xs font-medium"
        >
          Edit
        </button>
      )}
    </div>
  );
}
