import type { User } from "@/types/User";
import { getAllTokens } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL + "me";

export async function fetchMe(): Promise<User> {
  const { jwt } = getAllTokens(); // n’utilise QUE le jwt
  if (!jwt) throw new Error("Token manquant, veuillez vous reconnecter.");

  const res = await fetch(API_URL, {
    headers: {
      "accept": "application/ld+json",
      "Authorization": `Bearer ${jwt}`
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch user profile: ${res.status}`);
  }
  return res.json();
}
