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

//admin
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminLayout from "@/layouts/AdminLayout"
import AdminCategoriesPage from "@/pages/admin/categories/CategoriesAdmin";
import ProductsAdmin from "@/pages/admin/produits/ProductsAdmin";
import NewProductPage from "@/pages/admin/produits/NewProductPage"
import OrdersPage from "@/pages/admin/orders/OrdersPage";
import { UsersPage } from "@/pages/admin/users/UsersPage";
import AdminCarousel from "@/pages/admin/carousel/CarouselAdmin";
import NewCarouselSlidePage  from "@/pages/admin/carousel/NewCarouselAdmin";

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
    path: "/produit/:id",
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
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "categories",
        element: <AdminCategoriesPage />
      },
      {
        path: "produits",
        element: <ProductsAdmin />
      },
      {
        path: "produits/new",
        element: <NewProductPage />
      },
      {
        path: "produits/:id",
        element: <NewProductPage />
      },
      {
        path: "orders",
        element: <OrdersPage />
      },
      {
        path: "users",
        element: <UsersPage />
      },
      {
        path: "carousel",
        element: <AdminCarousel />
      },
      {
        path: "carousel/new",
        element: <NewCarouselSlidePage />
      }

      
      // Autres pages admin :
      // { path: "products", element: <AdminProducts /> },
      // { path: "orders", element: <AdminOrders /> },
      // etc.
    ],
  },
  
];


