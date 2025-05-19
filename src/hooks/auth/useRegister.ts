import { useState } from "react";
import type { RegisterCredentials } from "@/types/Register";
import { register as registerApi } from "@/features/account/api/auth";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(credentials: RegisterCredentials) {
    setLoading(true);
    setError(null);
    try {
      const response = await registerApi(credentials);
      return response;
    } catch (e: any) {
      setError(e.message || "Erreur d'inscription");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { handleRegister, loading, error };
}
