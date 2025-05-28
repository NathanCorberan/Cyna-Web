// src/hooks/auth/useAutoRefreshJwt.ts

import { useEffect } from "react";
import { getAllTokens, isJwtExpired, setTokens } from "@/lib/utils";
import { useRefreshToken } from "@/hooks/auth/useRefreshToken";

export function useAutoRefreshJwt() {
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const { jwt, refresh_token } = getAllTokens();

    if (jwt && isJwtExpired(jwt) && refresh_token) {
      refreshToken(refresh_token)
        .then((newTokens) => {
          if (newTokens?.jwt && newTokens?.refresh_token) {
            setTokens(newTokens);
          }
        })
        .catch((e) => {
        });
    }
  }, []);
}
