import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import RecentOrdersTable from "@/components/admin/recent-orders-table"
import SalesChart from "@/components/admin/sales-chart"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Ventes totales",
      value: "12,345 €",
      change: "+12%",
      trend: "up",
      icon: CreditCard,
      color: "bg-blue-500",
    },
    {
      title: "Commandes",
      value: "356",
      change: "+8%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      title: "Clients",
      value: "1,245",
      change: "+23%",
      trend: "up",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Taux de conversion",
      value: "3.2%",
      change: "-0.4%",
      trend: "down",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Exporter
          </Button>
          <Button size="sm" className="bg-[#302082] hover:bg-[#3a2a9d]">
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className={`flex items-center ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  <span className="text-sm font-medium">{stat.change}</span>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 ml-1" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventes</CardTitle>
            <CardDescription>Aperçu des ventes des 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
            <CardDescription>Les produits les plus vendus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Produit {i}</p>
                    <p className="text-xs text-gray-500">{120 - i * 15} ventes</p>
                  </div>
                  <div className="text-sm font-medium">{39.99 - i * 2} €</div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-[#302082]">
                Voir tous les produits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Les 10 dernières commandes passées</CardDescription>
          </div>
          <Link to="/admin/orders">
            <Button variant="outline" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              Voir tout
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable />
        </CardContent>
      </Card>
    </div>
  )
}
