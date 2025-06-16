import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { useMyOrders } from "@/hooks/orders/useMyOrders";

const getStatusInfo = (status: string) => {
  switch (status) {
    case "delivered":
    case "payed":
      return { label: "Livrée", color: "bg-green-100 text-green-800", icon: CheckCircle };
    case "shipped":
      return { label: "Expédiée", color: "bg-blue-100 text-blue-800", icon: Truck };
    case "processing":
      return { label: "En préparation", color: "bg-yellow-100 text-yellow-800", icon: Package };
    case "cancelled":
      return { label: "Annulée", color: "bg-red-100 text-red-800", icon: XCircle };
    default:
      return { label: "En attente", color: "bg-gray-100 text-gray-800", icon: Clock };
  }
};

export const HistoriqueCheckoutPage = () => {
  const { orders, loading, error } = useMyOrders();

  const totalOrders = orders.length;
  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

  return (
    <div className="min-h-screen">
      <main className="w-full flex flex-col items-center px-2 sm:px-8 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#302082] mb-4">Mes Commandes</h1>
            <div className="flex justify-center gap-8 text-sm text-gray-600">
              <div>
                <span className="font-medium text-[#302082]">{totalOrders}</span> commandes
              </div>
              <div>
                <span className="font-medium text-[#302082]">{totalSpent.toFixed(2)} €</span> dépensés
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-gray-400 text-lg">Chargement…</div>
          ) : error ? (
            <div className="flex justify-center py-20 text-red-500 text-lg">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">Aucune commande trouvée.</div>
          ) : (
            <div className="flex flex-col gap-8">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <Card
                    key={order.id}
                    className="w-full rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row w-full">
                        <div className="md:w-[350px] bg-white px-8 py-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{order.id}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Commandé le {new Date(order.orderDate).toLocaleDateString("fr-FR")}
                            </p>
                            <div
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium ${statusInfo.color}`}
                            >
                              <StatusIcon className="h-5 w-5" />
                              {statusInfo.label}
                            </div>
                          </div>
                          <div className="mt-6 text-right md:text-left">
                            <div className="font-bold text-xl text-[#302082]">
                              {Number(order.totalAmount).toFixed(2)} €
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 p-8 bg-gray-50 flex flex-col justify-between">
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Articles commandés</h4>
                            <div className="space-y-2">
                              {order.products.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-base">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                      <Package className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{item.name}</div>
                                      <div className="text-gray-600">Quantité: {item.quantity}</div>
                                    </div>
                                  </div>
                                  <div className="font-semibold">{Number(item.totalPrice).toFixed(2)} €</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Adresse de facturation</h4>
                            <p className="text-base text-gray-600">—</p>
                          </div>
                          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 mt-6">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" /> Voir détails
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Download className="h-4 w-4" /> Facture
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-12">
          <Link to="/cart">
            <Button variant="outline" className="px-8 py-3">
              Mon panier
            </Button>
          </Link>
          <Link to="/produits">
            <Button className="px-8 py-3 bg-[#302082] hover:bg-[#3a2a9d]">Continuer mes achats</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};
