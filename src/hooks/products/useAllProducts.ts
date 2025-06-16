import { useEffect, useState, useCallback } from "react";
import { fetchAllProducts } from "@/features/products/api/fetchAllProducts";
import type { Product } from "@/types/Product";

export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAllProducts()
      .then((data) => setProducts(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, refetch: load };
}
