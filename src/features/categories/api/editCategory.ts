// features/categories/api/editCategory.ts
export async function editCategory(
  id: number,
  data: {
    name: string;
    description: string;
    lang: string;
    category_order: number;
    imageFile?: File | null;
  },
  token: string
) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("lang", data.lang);
  formData.append("category_order", String(data.category_order));
  if (data.imageFile) {
    formData.append("imageFile", data.imageFile);
  }

  const res = await fetch(`http://srv839278.hstgr.cloud:8000/api/categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Erreur lors de la modification de la catégorie");
  }
  return res.json();
}
