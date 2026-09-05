import apiClient from "./client";
import type {
  CreateOrderRequest,
  CheckoutPaymentRequest,
  OrderResponse,
  // PaymentResponse,
  RecordPaymentResponse
} from "../types/billing";

export interface Invoice {
  invoice_id: string;
  order_id: number;
  customer_id: number;
  customer_name: string;
  customer_type: string;
  time: string;
  amount: number;
  amount_status: string;
  items_sold: number;
  payment_method?: string;
}

export const getInvoices = async (limit = 10): Promise<Invoice[]> => {
  const res = await apiClient.get<Invoice[]>("/invoices", { params: { limit } });
  return res.data;
};

export const createOrder = async (
  payload: CreateOrderRequest,
  idempotencyKey: string
): Promise<OrderResponse> => {
  const res = await apiClient.post<OrderResponse>("/new/order", payload, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return res.data;
};
//
// export const recordPayment = async (
//   orderId: number,
//   payload: CheckoutPaymentRequest,
//   idempotencyKey: string
// ): Promise<PaymentResponse> => {
//   const res = await apiClient.post<PaymentResponse>(
//     `/orders/${orderId}/payment`,
//     payload, {
//     headers: { "Idempotency-Key": idempotencyKey }
//   }
//   );
//   return res.data;
// };
//

export const recordPayment = async (
  orderId: number,
  payload: CheckoutPaymentRequest,
  idempotencyKey: string
): Promise<RecordPaymentResponse> => {
  const res = await apiClient.post<RecordPaymentResponse>(
    `/orders/${orderId}/payment`,
    payload,
    { headers: { "Idempotency-Key": idempotencyKey } }
  );
  return res.data;
};
