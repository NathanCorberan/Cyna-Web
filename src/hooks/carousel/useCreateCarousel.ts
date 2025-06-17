import { useState } from "react";
import { createCarousel } from "@/features/carousel/api/createCarousel";
import { getAllTokens } from "@/lib/utils";
import type { CreateCarouselInput } from "@/types/Carousel";

export function useCreateCarousel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateCarouselInput) => {
    setLoading(true);
    setError(null);

    const { token } = getAllTokens();
    if (!token) {
      setError("Token absent, veuillez vous reconnecter.");
      setLoading(false);
      throw new Error("Token absent");
    }

    try {
      const result = await createCarousel(data, token);
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
