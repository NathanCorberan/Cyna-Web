import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default function RecentOrdersTable() {
  const orders = [
    {
      id: "ORD-001",
      customer: "Jean Dupont",
      date: "16/05/2025",
      amount: "129.99 €",
      status: "completed",
    },
    {
      id: "ORD-002",
      customer: "Marie Martin",
      date: "15/05/2025",
      amount: "89.50 €",
      status: "processing",
    },
    {
      id: "ORD-003",
      customer: "Pierre Durand",
      date: "15/05/2025",
      amount: "245.00 €",
      status: "completed",
    },
    {
      id: "ORD-004",
      customer: "Sophie Petit",
      date: "14/05/2025",
      amount: "59.99 €",
      status: "shipped",
    },
    {
      id: "ORD-005",
      customer: "Lucas Bernard",
      date: "14/05/2025",
      amount: "175.50 €",
      status: "cancelled",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Terminée</Badge>
      case "processing":
        return <Badge className="bg-blue-500">En traitement</Badge>
      case "shipped":
        return <Badge className="bg-purple-500">Expédiée</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>
      default:
        return <Badge className="bg-gray-500">Inconnue</Badge>
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{order.amount}</TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Détails
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
