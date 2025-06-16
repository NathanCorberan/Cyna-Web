import { useEffect, useState } from "react";
import { fetchAllOrders } from "@/features/orders/api/fetchAllOrders"; // adapte le chemin si nécessaire
import type { Order } from "@/types/Order";

export const useAllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
      setError(null);
    } catch (e) {
      setError("Erreur lors du chargement des commandes.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
};
