// src/features/products/api/fetchAllProducts.ts

import type { ProductApiResponse, Product } from "@/types/Product";

const API_URL = import.meta.env.VITE_API_URL + "products";

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  const data: ProductApiResponse = await res.json();
  return data.member;
}
