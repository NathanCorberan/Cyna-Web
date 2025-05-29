// src/features/products/api/fetchProductById.ts

import type { ProductDetailApiResponse, ProductDetail } from "@/types/ProductDetail";

const API_URL = import.meta.env.VITE_API_URL + "products/";

export async function fetchProductById(id: string | number): Promise<ProductDetail> {
  const res = await fetch(API_URL + id, {
    headers: { accept: "application/ld+json" }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status}`);
  }
  const data: ProductDetailApiResponse = await res.json();

  if (!Array.isArray(data.member) || data.member.length < 8) {
    throw new Error("Invalid product data");
  }

  return {
    id: Number(data.member[0]),
    available_stock: Number(data.member[1]),
    updatedAt: String(data.member[2]),
    status: String(data.member[3]),
    code: String(data.member[4]),
    productLangages: Array.isArray(data.member[5]) ? data.member[5] : [],
    productImages: Array.isArray(data.member[6]) ? data.member[6] : [],
    subscriptionTypes: Array.isArray(data.member[7]) ? data.member[7] : [],
  };
}
