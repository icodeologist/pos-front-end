import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Role } from "../types/dashboard";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const storedRole = sessionStorage.getItem("pos-role");
  const initialRole: Role = storedRole === "staff" ? "staff" : "admin";
  const [role, setRoleState] = useState<Role>(initialRole);
  const [isAuthenticated, setIsAuthenticated] = useState(storedRole === "admin" || storedRole === "staff");
  const setRole = (nextRole: Role) => setRoleState(nextRole);
  const signIn = (nextRole: Role) => {
    sessionStorage.setItem("pos-role", nextRole);
    setRoleState(nextRole);
    setIsAuthenticated(true);
  };
  const signOut = () => {
    sessionStorage.removeItem("pos-role");
    setIsAuthenticated(false);
  };
  return (
    <RoleContext.Provider value={{ role, setRole, isAuthenticated, signIn, signOut }}>
      {children}
    </RoleContext.Provider>
  );
}

// This small app keeps its provider and hook together intentionally.
// eslint-disable-next-line react-refresh/only-export-components
export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
