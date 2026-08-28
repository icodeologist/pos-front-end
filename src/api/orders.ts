import apiClient from "./client";
import type {
  CreateOrderRequest,
  CheckoutPaymentRequest,
  OrderResponse,
  PaymentResponse,
} from "../types/billing";

export const createOrder = async (
  payload: CreateOrderRequest
): Promise<OrderResponse> => {
  const res = await apiClient.post<OrderResponse>("/new/order", payload);
  return res.data;
};

export const recordPayment = async (
  orderId: number,
  payload: CheckoutPaymentRequest
): Promise<PaymentResponse> => {
  const res = await apiClient.post<PaymentResponse>(
    `/order/${orderId}/payment`,
    payload
  );
  return res.data;
};
