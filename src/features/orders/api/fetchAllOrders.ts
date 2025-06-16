import type { OrderResponse, Order } from "@/types/Order";
import { getAllTokens } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL + "orders-processed";

export async function fetchAllOrders(): Promise<Order[]> {
  const jwt = getAllTokens().token;
  if (!jwt) throw new Error("Utilisateur non authentifié");

  const res = await fetch(API_URL, {
    headers: {
      "Authorization": `Bearer ${jwt}`,
      "Accept": "application/ld+json",
    },
  });

  if (!res.ok) {
    throw new Error(`Échec de la récupération des commandes : ${res.status}`);
  }

  const data: OrderResponse = await res.json();
  return data.member;
}
