// src/features/account/api/fetchRefresh.ts

const API_URL = import.meta.env.VITE_API_URL + "refresh";

export async function fetchRefresh(refresh_token: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/ld+json",
    },
    body: JSON.stringify({ refresh_token }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    console.error("Refresh error:", err || res.statusText);
    throw new Error(err?.detail || "Failed to refresh token");
  }

  return res.json(); // { token: "...", refresh_token: "..." }
}
