import type { LoginCredentials, LoginResponse } from "@/types/Login";
import type { RegisterCredentials, RegisterResponse } from "@/types/Register";



export async function login(credentials: LoginCredentials): Promise<LoginResponse> {

const API_URL = import.meta.env.VITE_API_URL + 'login';

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

export async function register(credentials: RegisterCredentials): Promise<RegisterResponse> {

const API_URL = import.meta.env.VITE_API_URL + 'users';

  const payload = { ...credentials, isActivate: credentials.isActivate ?? true };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Erreur d'inscription");
  }

  const data = await res.json();
  return data;
}