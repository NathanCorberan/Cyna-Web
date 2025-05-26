// src/features/products/api/fetchTopProducts.ts
import type { ProductApiResponse, Product } from "@/types/Product";

const API_URL = import.meta.env.VITE_API_URL + 'top/products';

export async function fetchTopProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch top products: ${res.status}`);
  }
  const data: ProductApiResponse = await res.json();
  return data.member;
}
