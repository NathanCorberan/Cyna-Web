import type { LoginCredentials, LoginResponse } from "@/types/Login";

const API_URL = import.meta.env.VITE_API_URL + 'login';


export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Erreur de connexion");
  }

  const token = await res.text();

  return { token };
}
