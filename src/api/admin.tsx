import apiClient from "./client";

// Matches your Go Admin struct's json tags: admin_name, admin_email, password
export interface RegisterPayload {
  admin_name: string;
  admin_email: string;
  password: string;
}

// Matches your Go AdminLoginInfo struct's json tags: email, password
export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerAdmin(payload: RegisterPayload) {
  const res = await apiClient.post("/admin/register", payload);
  return res.data;
}

export async function loginAdmin(payload: LoginPayload) {
  const res = await apiClient.post("/admin/login", payload);
  return res.data;
}

export async function loginStaff(payload: LoginPayload) {
  // The backend authenticates every approved account through this endpoint;
  // authorization comes from the role stored on that account.
  const res = await apiClient.post("/admin/login", payload);
  return res.data;
}
