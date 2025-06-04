// features/categories/api/deleteCategory.ts
export async function deleteCategory(id: number, token: string) {
  const res = await fetch(`http://srv839278.hstgr.cloud:8000/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Erreur lors de la suppression de la catégorie");
  }
}
