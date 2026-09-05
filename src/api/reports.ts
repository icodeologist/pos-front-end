import apiClient from "./client";

export interface ReportPaymentChannel {
  method: string;
  amount: number;
}

export interface ReportTopProduct {
  id: number;
  title: string;
  quantity: number;
  revenue: number;
}

export interface ReportTimingPeriod {
  period: "morning" | "afternoon" | "evening" | "night";
  label: string;
  orders: number;
}

export interface SalesReport {
  gross_billed: number;
  total_orders: number;
  items_sold: number;
  average_order_value: number;
  payment_channels: ReportPaymentChannel[];
  top_products: ReportTopProduct[];
  customer_timing: ReportTimingPeriod[];
}

export async function getSalesReport(): Promise<SalesReport> {
  const response = await apiClient.get<SalesReport>("/reports/summary");
  return response.data;
}
