import type { User } from "@/types/User";

const API_URL = import.meta.env.VITE_API_URL + "me";

export async function fetchMe(): Promise<User> {
  const jwtRaw = localStorage.getItem("jwt");
  let token = "";
  if (jwtRaw) {
    try {
      const parsed = JSON.parse(jwtRaw);
      token = parsed.token ?? ""; 
    } catch {
      token = jwtRaw;
    }
  }
  if (!token) throw new Error("Token manquant, veuillez vous reconnecter.");

  const res = await fetch(API_URL, {
    headers: {
      "accept": "application/ld+json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch user profile: ${res.status}`);
  }
  return res.json();
}
