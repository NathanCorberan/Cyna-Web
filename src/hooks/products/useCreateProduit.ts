import { useState } from "react";
import { createProduits } from "@/features/products/api/createProduct"; // adapte ce chemin
import { getAllTokens } from "@/lib/utils";
import type { CreateProduitInput } from "@/types/Product"; // définis ce type

export function useCreateProduit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateProduitInput) => {
    setLoading(true);
    setError(null);

    const { token } = getAllTokens();
    if (!token) {
      setError("Token absent, veuillez vous reconnecter.");
      setLoading(false);
      throw new Error("Token absent");
    }

    try {
      const result = await createProduits(data, token);
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
