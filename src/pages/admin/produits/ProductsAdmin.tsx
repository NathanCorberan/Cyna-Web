import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, Edit, Trash2, Filter, ArrowUpDown, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { useAllProducts } from "@/hooks/products/useAllProducts" 
import type { Product } from "@/types/Product"
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct"

export default function ProductsAdmin() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

  // Récupère les produits via le hook
  const { products, loading, error, refetch } = useAllProducts();

  const filteredProducts = products.filter((product: Product) => {
    const name = product.productLangages.find((l) => l.code === "FR")?.name || ""
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category_name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id)
    setShowDeleteDialog(true)
  }
    
  const { remove, loading: deleteLoading, error: deleteError } = useDeleteProduct()

  const confirmDelete = async () => {
    if (productToDelete === null) return;
    try {
      await remove(productToDelete);
      await refetch();
      setShowDeleteDialog(false);
      setProductToDelete(null);
    } catch (e) {
      console.error("Erreur suppression :", e);
    }
  };

  const getStatusBadge = (stock: number) => {
    if (stock > 10) {
      return <Badge className="bg-green-500">En stock</Badge>
    } else if (stock > 0) {
      return <Badge className="bg-orange-500">Stock faible ({stock})</Badge>
    } else {
      return <Badge className="bg-red-500">Rupture de stock</Badge>
    }
  }

const PRODUITS_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/products/"

  // Génère dynamiquement les catégories depuis les produits récupérés
  const categories = Array.from(new Set(products.map((p) => p.category_name)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <Link to="/admin/produits/new">
          <Button className="bg-[#302082] hover:bg-[#3a2a9d]">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>
        </div>

        {/* Gestion du chargement, erreur et affichage normal */}
        {loading ? (
          <div className="py-12 text-center text-gray-500">Chargement des produits…</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">Erreur : {error}</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer">
                      Produit
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-center">Abonnements</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: Product) => {
                  const productName = product.productLangages.find((l) => l.code === "fr")?.name || "Sans nom"
                  const image = product.productImages[0]?.image_link
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img
                              src={/^https?:\/\//.test(image) ? image : PRODUITS_IMAGE_BASE + `${image}`}
                              alt={productName}
                              className="w-10 h-10 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                              <span>?</span>
                            </div>
                          )}
                          <span>{productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.category_name}</TableCell>
                      <TableCell className="text-right">{product.available_stock}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(product.available_stock)}</TableCell>
                      <TableCell className="text-center">
                        {product.subscriptionTypes && product.subscriptionTypes.length > 0 ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {product.subscriptionTypes.map((type) => (
                              <Badge key={type.id} className="bg-blue-500">
                                {type.type} <span className="ml-1 font-normal">{type.price}</span>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/produits/${product.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(product.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Affichage de {filteredProducts.length} sur {products.length} produits
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

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteLoading}>
              {deleteLoading ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
