import type { TokensResult } from "@/types/TokensResult";

const API_URL = import.meta.env.VITE_API_URL + "refresh";

export async function fetchRefresh(refresh_token: string): Promise<TokensResult> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  if (!res.ok) throw new Error("Échec du refresh token");
  return res.json();
}
