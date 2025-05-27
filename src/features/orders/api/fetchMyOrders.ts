import type { OrderApiResponse, UserOrderOutputDto } from "@/types/Order";
import { getAllTokens } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL + "my-orders";

export async function fetchMyOrders(): Promise<UserOrderOutputDto[]> {
  const jwt = getAllTokens().jwt;
  if (!jwt) throw new Error("Utilisateur non authentifié");

  const res = await fetch(API_URL, {
    headers: {
      "Authorization": `Bearer ${jwt}`,
      "Accept": "application/ld+json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.status}`);
  }
  const data: OrderApiResponse = await res.json();
  return data.member;
}
