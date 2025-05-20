import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TokensResult } from "@/types/TokensResult";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("jwt"));
}

export function logout(): void {
  localStorage.removeItem("jwt");
}

export function getAllTokens(): TokensResult {
  let jwt: string | null = null;
  const jwtRaw = localStorage.getItem("jwt");
  if (jwtRaw) {
    try {
      const parsed = JSON.parse(jwtRaw);
      if (typeof parsed === "object" && typeof parsed.token === "string") {
        jwt = parsed.token;
      } else {
        jwt = jwtRaw;
      }
    } catch {
      jwt = jwtRaw;
    }
  }

  let cartToken: string | null = null;
  const cartTokenRaw = localStorage.getItem("cartToken");
  if (cartTokenRaw) {
    try {
      const parsed = JSON.parse(cartTokenRaw);
      if (typeof parsed === "object" && typeof parsed.token === "string") {
        cartToken = parsed.token;
      } else {
        cartToken = cartTokenRaw;
      }
    } catch {
      cartToken = cartTokenRaw;
    }
  }

  return { jwt, cartToken };
}