import apiClient from "./client";
import type { Product } from "../types/billing";

export const getProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>("/products");
  return res.data;
};
