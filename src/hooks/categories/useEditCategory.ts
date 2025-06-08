import { useState } from "react";
import { getAllTokens } from "@/lib/utils";
import { editCategory as postCategory } from "@/features/categories/api/editCategory";
import { deleteCategory } from "@/features/categories/api/deleteCategory";
import type { CategoryFormInput } from "@/types/Category";

export function useEditCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nouveau “edit” : suppression puis POST (création)
  const edit = async (id: number, data: CategoryFormInput) => {
    setLoading(true);
    setError(null);
    const { token } = getAllTokens();
    if (!token) {
      setError("Token absent, veuillez vous reconnecter.");
      setLoading(false);
      throw new Error("Token absent");
    }
    try {
      // 1. Delete (attendre la fin)
      await deleteCategory(id, token);

      // 2. Create (POST) : on ne passe PAS l’id
      const result = await postCategory(data, token);

      setLoading(false);
      return result;
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
      setLoading(false);
      throw e;
    }
  };

  return { edit, loading, error };
}
