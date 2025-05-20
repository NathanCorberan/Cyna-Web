// src/hooks/products/useTopProducts.ts
import { useEffect, useState } from "react";
import { fetchTopProducts } from "@/features/products/api/fetchTopProducts";
import type { Product } from "@/types/Product";

export function useTopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchTopProducts()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((e) => {
        if (isMounted) setError(e.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}
