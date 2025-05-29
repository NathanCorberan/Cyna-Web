// src/hooks/products/useProductById.ts

import { useEffect, useState } from "react";
import { fetchProductById } from "@/features/products/api/fetchProductById";
import type { ProductDetail } from "@/types/ProductDetail";

export function useProductById(productId: string | number) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setProduct(null);

    fetchProductById(productId)
      .then((data) => { if (isMounted) setProduct(data); })
      .catch((e) => { if (isMounted) setError(e.message); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [productId]);

  return { product, loading, error };
}
