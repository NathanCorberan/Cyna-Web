// src/hooks/auth/useRefreshToken.ts
import { fetchRefresh } from "@/features/account/api/fetchRefresh";

export function useRefreshToken() {
  return async (refresh_token: string) => {
    return await fetchRefresh(refresh_token);
  };
}
