import { useEffect, useState, useCallback } from "react";
import { fetchCart } from "@/features/cart/api/fetchCart";
import type { CartAPIResponse } from "@/types/Cart";

export function useCart(cartToken?: string, jwt?: string) {
  const [cart, setCart] = useState<CartAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Factorise la logique dans une fonction refetch
  const refetch = useCallback(() => {
    if (!cartToken && !jwt) {
      setCart(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    fetchCart({ cartToken, jwt })
      .then(setCart)
      .catch((err) => setError(err.message || "Erreur"))
      .finally(() => setLoading(false));
  }, [cartToken, jwt]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { cart, loading, error, refetch };
}
