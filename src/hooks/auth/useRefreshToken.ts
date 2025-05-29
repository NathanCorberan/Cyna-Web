import { useCallback } from "react";
import { fetchRefresh } from "@/features/account/api/fetchRefresh";

// Utilisation : const refreshToken = useRefreshToken(); await refreshToken(refresh_token)
export function useRefreshToken() {
  return useCallback(async (refresh_token: string) => {
    if (!refresh_token) return null;
    try {
      const tokens = await fetchRefresh(refresh_token);
      return tokens; // { token, refresh_token }
    } catch (e) {
      return null;
    }
  }, []);
}
