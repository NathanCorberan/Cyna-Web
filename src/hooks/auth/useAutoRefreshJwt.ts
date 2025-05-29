import { useEffect } from "react";
import { getAllTokens, isJwtExpired, setTokens } from "@/lib/utils";
import { useRefreshToken } from "@/hooks/auth/useRefreshToken";

// A appeler dans ton <App /> pour auto-refresh au chargement (si besoin)
export function useAutoRefreshJwt() {
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const { token, refresh_token } = getAllTokens();

    if (token && isJwtExpired(token) && refresh_token) {
      refreshToken(refresh_token)
        .then((newTokens) => {
          if (newTokens?.token && newTokens.refresh_token) {
            setTokens({ token: newTokens.token, refresh_token: newTokens.refresh_token });
          }
        })
        .catch(() => {});
    }
  }, []);
}
