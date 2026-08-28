import apiClient from "./client";
import type {
  CreateOrderRequest,
  CheckoutPaymentRequest,
  OrderResponse,
  // PaymentResponse,
  RecordPaymentResponse
} from "../types/billing";

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
