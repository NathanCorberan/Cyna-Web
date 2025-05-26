import type { RouteObject } from "react-router-dom";
import { Home } from "@/pages/home/Home";
import { Login } from "@/pages/account/login/Login";
import { Register } from "@/pages/account/register/Register";
import { GuestRoute, GuestRouteNotLog } from "@/features/account/components/GuestRoute";
import { Profile } from "@/pages/account/profile/Profile";
import { Produit } from "@/pages/produits/Produits";
import { Cart } from "@/pages/cart/Cart";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  {
    path: "/account",
    element: (
      <GuestRouteNotLog>
        <Profile />
      </GuestRouteNotLog>
    ),
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/categorie/:id",
    element: <Produit />,
  },
];


