interface CreateProductCardProps {
  onClick: () => void;
}

export default function CreateProductCard({ onClick }: CreateProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="border-2 border-dashed border-emerald-700 rounded-xl px-5 py-5 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-colors min-h-[104px]"
    >
      <span className="text-3xl leading-none">+</span>
    </button>
  );
}
