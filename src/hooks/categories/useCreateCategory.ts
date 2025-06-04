import { useState } from "react";
import { createCategory } from "@/features/categories/api/createCategory";
import { getAllTokens } from "@/lib/utils";
import type { CategoryFormInput } from "@/types/Category";

export function useCreateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CategoryFormInput) => {
    setLoading(true);
    setError(null);

    const { token } = getAllTokens();
    if (!token) {
      setError("Token absent, veuillez vous reconnecter.");
      setLoading(false);
      throw new Error("Token absent");
    }

    try {
      const result = await createCategory(data, token);
      setLoading(false);
      return result;
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
      setLoading(false);
      throw e;
    }
  };

  return { create, loading, error };
}
