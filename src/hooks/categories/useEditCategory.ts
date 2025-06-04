// hooks/categories/useEditCategory.ts
import { useState } from "react";
import { editCategory } from "@/features/categories/api/editCategory";
import { getAllTokens } from "@/lib/utils";
import type { CategoryFormInput } from "@/types/Category";

export function useEditCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const result = await editCategory(id, data, token);
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
