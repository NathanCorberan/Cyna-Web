import type { UserAdminResponse, UserAdmin } from "@/types/User";
import { getAllTokens } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL + "users/all";

export async function fetchAllUsers(): Promise<UserAdminResponse[]> {
  const jwt = getAllTokens().token;
  if (!jwt) throw new Error("Utilisateur non authentifié");

  const res = await fetch(API_URL, {
    headers: {
      "Authorization": `Bearer ${jwt}`,
      "Accept": "application/ld+json",
    },
  });

  if (!res.ok) {
    throw new Error(`Échec de la récupération des utilisateurs : ${res.status}`);
  }

  const data: UserAdmin = await res.json();
  return data.member;
}
