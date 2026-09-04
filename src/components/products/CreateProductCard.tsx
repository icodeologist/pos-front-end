interface CreateProductCardProps {
  onClick: () => void;
}

export default function CreateProductCard({ onClick }: CreateProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-5 py-5 text-slate-400 transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-500"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-2xl font-light">+</span><span className="mt-3 whitespace-nowrap text-xs font-bold">Add product</span>
    </button>
  );
}
