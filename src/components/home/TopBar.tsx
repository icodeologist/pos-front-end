import type { Role } from "../../types/dashboard";

interface TopBarProps {
  role: Role;
}

// MOCK: replace with real data from GET /admin/me once that route exists.
const MOCK_USER = {
  admin: { name: "Admin User", email: "admin@shop.com" },
  staff: { name: "Staff User", email: "staff@shop.com" },
};

export default function TopBar({ role }: TopBarProps) {
  const user = MOCK_USER[role];

  return (
    <div className="border border-stone-200 bg-white rounded-xl px-5 py-3 text-right">
      <p className="text-stone-800 text-sm font-medium">{user.name}</p>
      <p className="text-stone-400 text-xs">{user.email}</p>
      <p className="text-stone-400 text-xs mt-1 uppercase tracking-wide">
        {role} access
      </p>
    </div>
  );
}
