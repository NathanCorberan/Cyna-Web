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
import { HistoriqueCheckoutPage } from "@/pages/checkout/HistoriqueCheckout";
import ProductDetail from "@/pages/produits/ProduitDetails";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import SuccessPage from "@/pages/checkout/SuccessPage"; 
import AbonnementsPage from "@/pages/subscription/MySubscription"; 

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
  },
  {
    path:"/checkout",
    element:<HistoriqueCheckoutPage />
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
  {
    path: "/checkout/:orderId",
    element: <CheckoutPage />,
  },
  {
    path: "/success",
    element: <SuccessPage />,
  },
  {
    path: "/abonnements",
    element: <AbonnementsPage />
  },
];


