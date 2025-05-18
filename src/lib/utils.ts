import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("jwt"));
}

export function logout(): void {
  localStorage.removeItem("jwt");
}