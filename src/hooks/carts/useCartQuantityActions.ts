import { useState } from "react";
import { incrementOrderItem } from "@/features/cart/api/incrementOrderItem";
import { decrementOrderItem } from "@/features/cart/api/decrementOrderItem";

export function useCartQuantityActions(refetchCart: () => void) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const increment = async (id: number) => {
    setLoadingId(id);
    setError(null);
    try {
      await incrementOrderItem(id);
      refetchCart();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const decrement = async (id: number) => {
    setLoadingId(id);
    setError(null);
    try {
      await decrementOrderItem(id);
      refetchCart();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  return { increment, decrement, loadingId, error };
}
