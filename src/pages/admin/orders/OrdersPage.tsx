import { useState } from "react"
import type { ChangeEvent } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUpDown, Eye, Download } from "lucide-react"
import { useAllOrders } from "@/hooks/orders/useAllOrders"

type Order = {
  id: string
  customer: string
  email: string
  date: string
  amount: string | number
  paymentMethod: string
  status: string
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const { orders = [], loading, error, refetch } = useAllOrders() as {
    orders: Order[]
    loading: boolean
    error: string | null
    refetch: () => void
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Terminée</Badge>
      case "cart":
        return <Badge className="bg-blue-500">Panier</Badge>
      default:
        return <Badge className="bg-gray-500 capitalize">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des commandes</h1>
        <Button onClick={refetch} className="bg-[#302082] hover:bg-[#3a2a9d]">Actualiser</Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par ID, client ou email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Terminée</SelectItem>
              <SelectItem value="cart">Panier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Chargement des commandes…</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">Erreur : {error}</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-1 cursor-pointer">
                      ID
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right font-medium">{order.amount}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger la facture
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Aucune commande trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Affichage de {filteredOrders.length} sur {orders.length} commandes
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" className="bg-[#302082] text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Suivant
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
