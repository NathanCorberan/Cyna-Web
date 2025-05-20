// src/components/GuestRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

export function GuestRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}


export function GuestRouteNotLog({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn === false ? <Navigate to="/" replace /> : children;
}
