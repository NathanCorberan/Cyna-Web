import type { Category } from "@/types/Category";

export async function fetchCategoryById(id: string | number): Promise<Category> {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}categories/${id}`);
  if (!res.ok) {
    throw new Error(`Erreur lors du chargement de la catégorie ${id}`);
  }
  return res.json();
}
