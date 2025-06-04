// hooks/categories/useDeleteCategory.ts
import { useState } from "react";
import { deleteCategory } from "@/features/categories/api/deleteCategory";
import { getAllTokens } from "@/lib/utils";

export function useDeleteCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    const { token } = getAllTokens();
    if (!token) {
      setError("Token absent, veuillez vous reconnecter.");
      setLoading(false);
      throw new Error("Token absent");
    }
    try {
      await deleteCategory(id, token);
      setLoading(false);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
      setLoading(false);
      throw e;
    }
  };

  return { remove, loading, error };
}
