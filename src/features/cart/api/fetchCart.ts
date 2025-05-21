import type { CartAPIResponse } from "@/types/Cart";

// Tu pourrais déclarer l'URL de l'API ainsi :
const API_URL = import.meta.env.VITE_API_URL + 'cart';

export async function fetchCart(options?: { 
  cartToken?: string; 
  jwt?: string; 
}): Promise<CartAPIResponse | null> {
  const headers: Record<string, string> = {};

  if (options?.cartToken) headers["X-Cart-Token"] = options.cartToken;
  if (options?.jwt) headers["Authorization"] = `Bearer ${options.jwt}`;

  if (!options?.cartToken && !options?.jwt) {
    return null;
  }

  const res = await fetch(API_URL, { headers, credentials: "include" });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch cart: ${res.status}`);
  }
  const data: CartAPIResponse = await res.json();
  return data;
}
