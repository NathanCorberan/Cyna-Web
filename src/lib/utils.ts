import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TokensResult } from "@/types/TokensResult";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check si authentifié : présence du token !
export function isAuthenticated(): boolean {
  return Boolean(getAllTokens().token);
}

// Déconnexion (on peut aussi wipe cartToken si besoin)
export function logout(): void {
  localStorage.removeItem("jwt");
  localStorage.removeItem("cartToken");
}

// Récupère tokens (toujours au format { token, refresh_token, cartToken? })
export function getAllTokens(): TokensResult & { cartToken?: string | null } {
  let token: string | null = null;
  let refresh_token: string | null = null;

  const jwtRaw = localStorage.getItem("jwt");
  if (jwtRaw) {
    try {
      const parsed = JSON.parse(jwtRaw);
      token = parsed.token ?? null;
      refresh_token = parsed.refresh_token ?? null;
    } catch {
      token = jwtRaw;
    }
  }

  let cartToken: string | null = null;
  const cartTokenRaw = localStorage.getItem("cartToken");
  if (cartTokenRaw) {
    try {
      const parsed = JSON.parse(cartTokenRaw);
      cartToken = parsed.token ?? cartTokenRaw;
    } catch {
      cartToken = cartTokenRaw;
    }
  }

  return { token, refresh_token, cartToken };
}

// Sauvegarde les tokens sous la bonne forme
export function setTokens(data: { token: string; refresh_token: string }) {
  localStorage.setItem("jwt", JSON.stringify({ token: data.token, refresh_token: data.refresh_token }));
}

// Test si JWT expiré
export function isJwtExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const payload = JSON.parse(atob(padded));
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return false;
  }
}
