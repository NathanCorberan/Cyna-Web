import type { CategoryApiResponse, Category } from '../../../types/Category';

const API_URL = import.meta.env.VITE_API_URL + 'categories';

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }
  const data: CategoryApiResponse = await res.json();
  return data.member;
}
