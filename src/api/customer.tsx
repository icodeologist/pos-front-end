import apiClient from "./client";

// Matches your Go Customer struct's json tags exactly.
export interface Customer {
  ID: number;
  name: string;
  phone_number: string;
  balance: number;
}

export interface RegisterCustomerPayload {
  name: string;
  phone_number: string;
}

// Returns the customer if found. Throws if not found (404) or on error —
// the component decides what "not found" means for the UI.
export async function getCustomerByPhone(phone: string): Promise<Customer> {
  const res = await apiClient.get(`/customer/${phone}`);
  return res.data;
}

export async function registerCustomer(
  payload: RegisterCustomerPayload
): Promise<Customer> {
  const res = await apiClient.post("/customer/register", payload);
  return res.data;
}
