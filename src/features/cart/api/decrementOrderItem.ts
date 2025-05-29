import { getAllTokens } from "@/lib/utils";

export async function decrementOrderItem(id: number) {
  const { token } = getAllTokens();
  const res = await fetch(`${import.meta.env.VITE_API_URL}order_items/${id}/decrement`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  });
  if (!res.ok) throw new Error("Erreur lors de la décrémentation");
  return res.json();
}
