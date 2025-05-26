import { useEffect, useState } from "react";
import { fetchProductsByCategory } from "@/features/products/api/fetchProductsByCategory";
import type { CategoryProduct } from "@/types/CategoryProducts";

export function useProductsByCategory(categoryId: string | number) {
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchProductsByCategory(categoryId)
      .then((data) => { if (isMounted) setProducts(data); })
      .catch((e) => { if (isMounted) setError(e.message); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [categoryId]);

  return { products, loading, error };
}
