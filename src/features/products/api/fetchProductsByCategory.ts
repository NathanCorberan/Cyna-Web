import type { CategoryProduct, CategoryProductsApiResponse } from "@/types/CategoryProducts";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProductsByCategory(categoryId: string | number): Promise<CategoryProduct[]> {
  const res = await fetch(`${API_URL}categorie/${categoryId}/products`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products for category ${categoryId}: ${res.status}`);
  }
  const data: CategoryProductsApiResponse = await res.json();
  return data.member;
}
