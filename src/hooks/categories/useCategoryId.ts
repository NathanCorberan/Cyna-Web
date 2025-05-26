import { useEffect, useState } from "react";
import { fetchCategoryById } from "@/features/categories/api/fetchCategoryById";
import type { Category } from "@/types/Category";

export function useCategoryId(id?: string | number) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchCategoryById(id)
      .then(setCategory)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { category, loading, error };
}
