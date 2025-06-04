import { useEffect, useState, useCallback } from "react";
import { fetchCategories } from "@/features/categories/api/fetchCategories";
import type { Category } from "@/types/Category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, loading, error, refetch: load };
}
