import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TokensResult } from "@/types/TokensResult";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAuthenticated(): boolean {
  return Boolean(getAllTokens().jwt);
}

export function logout(): void {
  localStorage.removeItem("jwt");
  localStorage.removeItem("cartToken");
}

export function getAllTokens(): TokensResult & { cartToken?: string | null } {
  let jwt: string | null = null;
  let refresh_token: string | null = null;

  const jwtRaw = localStorage.getItem("jwt");
  if (jwtRaw) {
    try {
      const parsed = JSON.parse(jwtRaw);
      jwt = parsed.token ?? parsed.jwt ?? null;
      refresh_token = parsed.refresh_token ?? null;
    } catch {
      jwt = jwtRaw;
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

  return { jwt, refresh_token, cartToken };
}

export function setTokens(data: any) {
  const tokens = {
    token: data.token,
    refresh_token: data.refresh_token,
  };
  localStorage.setItem("jwt", JSON.stringify(tokens));
}


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
