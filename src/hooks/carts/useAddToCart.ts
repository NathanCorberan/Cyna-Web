import { useState, useCallback } from "react";
import type { OrderItem } from "@/types/OrderItem";
import { addToCart } from "@/features/cart/api/addToCart";

export function useAddToCart() {
  const [loading, setLoading] = useState(false);
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(
    async (
      product_id: number,
      quantity: number,
      options?: { cartToken?: string; jwt?: string }
    ) => {
      setLoading(true);
      setError(null);
      setOrderItem(null);
      try {
        const data = await addToCart(product_id, quantity, options);
        setOrderItem(data);
        return data;
      } catch (e: any) {
        setError(e?.message || "Erreur inconnue");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    addToCart: add,
    orderItem,
    loading,
    error,
  };
}
