import type { ActionItem } from "../../types/dashboard";

interface ActionGridProps {
  actions: ActionItem[];
}

export default function ActionGrid({ actions }: ActionGridProps) {
  return (
    <div>
      <p className="text-stone-500 mb-3">What would you like to do?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="border border-stone-200 hover:border-emerald-700 bg-white rounded-xl px-5 py-6 text-left transition-colors"
          >
            <p className="text-stone-800 font-medium mb-1">{action.label}</p>
            <p className="text-stone-400 text-xs">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
