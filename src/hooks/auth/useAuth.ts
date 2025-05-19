import { useCallback, useMemo } from "react";

// Simple décodage JWT (sans vérif, pour lecture user/roles)
function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function useAuth() {
  const token = localStorage.getItem("jwt");
  const user = useMemo(() => (token ? decodeJWT(token) : null), [token]);
  const isLoggedIn = Boolean(token && user);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  }, []);

  return { token, user, isLoggedIn, logout };
}
