// src/hooks/useLogin.ts

import { useState } from "react";
import { login } from "@/lib/auth";
import type { LoginCredentials } from "@/types/Login";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await login(credentials);
      localStorage.setItem("jwt", token);
      return token;
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}
