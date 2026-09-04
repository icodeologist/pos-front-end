import apiClient from "./client";
import type { Product } from "../types/billing";

export const getProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>("/products");
  return res.data;
};

// Matches models.Product json tags exactly — server assigns id.
export interface CreateProductPayload {
  title: string;
  price: number;
  unit: string;
  taxRate: number;
  stockQuantity: number;
}

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const res = await apiClient.post<Product>("/products/new", payload);
  return res.data;
};

// Matches UpdateProductInfo json tags — NOTE: "stock", not "stockQuantity".
export interface UpdateProductPayload {
  title?: string;
  price?: number;
  stock?: number;
}

export const updateProduct = async (
  id: number,
  payload: UpdateProductPayload
): Promise<Product> => {
  const res = await apiClient.patch<Product>(`/products/edit/${id}`, payload);
  return res.data;
};
