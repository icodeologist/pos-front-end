import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/home/Sidebar";
import TopBar from "../components/home/TopBar";
import StatsBanner from "../components/home/StatsBanner";
import ActionGrid from "../components/home/ActionGrid";
import type { Role, ActionItem } from "../types/dashboard";

export default function Home() {
  const navigate = useNavigate();
  // MOCK ONLY: no real role check yet — toggle to preview both views.
  // Remove this once BE role/auth is wired up.
  const [role, setRole] = useState<Role>("admin");

  const adminActions: ActionItem[] = [
    { label: "Create Order", description: "Start a new sale", onClick: () => navigate("/billing") },
    { label: "Manage Products", description: "Edit catalog & stock", onClick: () => { } },
    { label: "View Reports", description: "Sales & credit summary", onClick: () => { } },
  ];

  const staffActions: ActionItem[] = [
    { label: "Create Order", description: "Start a new sale", onClick: () => navigate("/billing") },
  ];

  const actions = role === "admin" ? adminActions : staffActions;

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      {/* MOCK role switcher — dev only, delete once real auth roles exist */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setRole(role === "admin" ? "staff" : "admin")}
          className="text-xs text-stone-400 border border-stone-200 rounded-full px-3 py-1 hover:border-stone-400"
        >
          Viewing as: {role} (click to switch)
        </button>
      </div>

      <div className="flex gap-6">
        <Sidebar role={role} />

        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="font-fraunces text-2xl text-stone-800 mb-1">
                Poultry Shop
              </h1>
              <p className="text-stone-500 text-sm">
                {role === "admin" ? "Admin dashboard" : "Staff dashboard"}
              </p>
            </div>
            <TopBar role={role} />
          </div>

          <StatsBanner />
          <ActionGrid actions={actions} />
        </div>
      </div>
    </div>
  );
}
