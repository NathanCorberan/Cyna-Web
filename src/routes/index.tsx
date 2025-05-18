import type { RouteObject } from "react-router-dom";
import { Home } from "@/pages/home/Home";
import { Login } from "@/pages/account/login/Login";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
