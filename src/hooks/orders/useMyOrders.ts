import { useEffect, useState } from "react";
import { fetchMyOrders } from "@/features/orders/api/fetchMyOrders";
import type { UserOrderOutputDto } from "@/types/Order";

export function useMyOrders() {
  const [orders, setOrders] = useState<UserOrderOutputDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchMyOrders()
      .then((data) => {
        if (isMounted) setOrders(data);
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

  return { orders, loading, error };
}
