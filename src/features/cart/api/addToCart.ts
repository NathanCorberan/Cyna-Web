import type { OrderItem } from "@/types/OrderItem";

const API_URL = import.meta.env.VITE_API_URL + 'order_items';

export async function addToCart(
  product_id: number,
  quantity: number,
  options?: {
    cartToken?: string;
    jwt?: string;
  }
): Promise<OrderItem | null> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.cartToken) headers["X-Cart-Token"] = options.cartToken;
  if (options?.jwt) headers["Authorization"] = `Bearer ${options.jwt}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ product_id, quantity }),
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de l'ajout au panier : ${res.status}`);
  }

  // ATTENTION : Ici on parse la réponse comme OrderItem !
  const data: OrderItem = await res.json();

  // On récupère le cartToken s'il est présent dans data.order
  if ("cartToken" in data.order && data.order.cartToken) {
    localStorage.setItem("cartToken", data.order.cartToken);
  }

  return data;
}