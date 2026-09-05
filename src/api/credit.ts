import apiClient from "./client";

export interface CreditSummary {
  total_credit: number;
  pending_collections: number;
  total_customers: number;
  pending_customer_percentage: number;
  settlement_health: "Clear" | "Healthy" | "Watch" | "At risk";
}

export async function getCreditSummary(): Promise<CreditSummary> {
  const response = await apiClient.get<CreditSummary>("/credit/summary");
  return response.data;
}
