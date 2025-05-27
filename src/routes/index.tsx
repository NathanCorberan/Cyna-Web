import type { RouteObject } from "react-router-dom";
import { Home } from "@/pages/home/Home";
import { Login } from "@/pages/account/login/Login";
import { Register } from "@/pages/account/register/Register";
import { GuestRoute, GuestRouteNotLog } from "@/features/account/components/GuestRoute";
import { Profile } from "@/pages/account/profile/Profile";
import { ProduitsByCategories } from "@/pages/produits/ProduitsByCategories";
import { Cart } from "@/pages/cart/Cart";
import { AllProducts } from "@/pages/produits/AllProducts"
import { AllCategories } from "@/pages/categories/AllCategories";

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
    path: "/categorie/:id/produits",
    element: <ProduitsByCategories />,
  },
  {
    path: "/produits",
    element: <AllProducts />,
  },
  {
    path: "/categories",
    element: <AllCategories />
  }
];


