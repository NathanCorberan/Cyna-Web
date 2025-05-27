import { useEffect, useState } from "react";
import { fetchAllProducts } from "@/features/products/api/fetchAllProducts";
import type { Product } from "@/types/Product";

export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchAllProducts()
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
