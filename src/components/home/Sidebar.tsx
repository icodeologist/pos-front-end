import { useNavigate } from "react-router-dom";
import type { Role } from "../../types/dashboard";

interface SidebarProps {
  role: Role;
}

interface SidebarLink {
  label: string;
  path: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const navigate = useNavigate();

  const adminLinks: SidebarLink[] = [
    { label: "Products", path: "/products" },
    { label: "Reports", path: "/reports" },
    { label: "Manage Staff", path: "/staff" },
  ];
  const staffLinks: SidebarLink[] = [
    { label: "My Orders", path: "/orders" },
  ];

  const links = role === "admin" ? adminLinks : staffLinks;

  return (
    <div className="w-56 shrink-0 border border-stone-200 bg-white rounded-xl px-4 py-6 flex flex-col h-full">
      <p className="font-fraunces text-lg text-stone-800 mb-6">Menu</p>

      <div className="space-y-3 flex-1">
        {links.map((link) => (
          <button
            key={link.label}
            onClick={() => navigate(link.path)}
            className="w-full text-left border border-stone-200 rounded-lg px-4 py-2 text-stone-600 hover:border-emerald-700 hover:text-emerald-800 transition-colors text-sm"
          >
            {link.label}
          </button>
        ))}
      </div>

      <button className="w-full text-left border border-stone-200 rounded-lg px-4 py-2 text-stone-500 hover:border-stone-400 text-sm">
        Settings / Logout
      </button>
    </div>
  );
}
