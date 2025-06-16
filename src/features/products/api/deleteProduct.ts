export async function deleteProduct(id: number, token: string) {
  const API_URL = import.meta.env.VITE_API_URL + `products/${id}`;

  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Erreur lors de la suppression du produit");
  }
}
