import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Users,
  ShoppingCart,
  Settings,
  BarChart,
  Tag,
  Newspaper,
  BanIcon,
  Film,
} from "lucide-react"
import { cn } from "../../lib/utils"

interface AdminSidebarContentProps {
  isCollapsed?: boolean
}

export default function AdminSidebarContent({ isCollapsed = false }: AdminSidebarContentProps) {
  const location = useLocation()

  const menuItems = [
    { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/admin/categories", label: "Catégories", icon: FolderTree },
    { to: "/admin/produits", label: "Produits", icon: ShoppingBag },
    { to: "/admin/orders", label: "Commandes", icon: ShoppingCart },
    { to: "/admin/users", label: "Utilisateurs", icon: Users },
    { to: "/admin/carousel", label: "Carousel", icon: Film },
    { to: "/admin/news", label: "Nouveautées", icon: Newspaper },
  ]

  return (
    <div className="py-4">
      <nav>
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn
                    ? cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )
                    : `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
