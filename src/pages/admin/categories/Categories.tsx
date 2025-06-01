import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  const categories = [
    {
      id: 1,
      name: "Vêtements",
      slug: "vetements",
      description: "Tous nos vêtements",
      products: 45,
      active: true,
      parent: null,
      children: [
        {
          id: 5,
          name: "Hommes",
          slug: "vetements-hommes",
          description: "Vêtements pour hommes",
          products: 25,
          active: true,
          parent: 1,
          children: [],
        },
        {
          id: 6,
          name: "Femmes",
          slug: "vetements-femmes",
          description: "Vêtements pour femmes",
          products: 20,
          active: true,
          parent: 1,
          children: [],
        },
      ],
    },
    {
      id: 2,
      name: "Chaussures",
      slug: "chaussures",
      description: "Toutes nos chaussures",
      products: 28,
      active: true,
      parent: null,
      children: [],
    },
    {
      id: 3,
      name: "Accessoires",
      slug: "accessoires",
      description: "Tous nos accessoires",
      products: 36,
      active: true,
      parent: null,
      children: [],
    },
    {
      id: 4,
      name: "Électronique",
      slug: "electronique",
      description: "Tous nos produits électroniques",
      products: 12,
      active: false,
      parent: null,
      children: [],
    },
  ]

  const toggleExpand = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
  }

  const handleEditClick = (category: any) => {
    setSelectedCategory(category)
    setShowEditDialog(true)
  }

  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderCategoryRow = (category: any, level = 0) => {
    const isExpanded = expandedCategories.includes(category.id)
    const hasChildren = category.children && category.children.length > 0

    return (
      <>
        <TableRow key={category.id}>
          <TableCell>
            <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
              {hasChildren && (
                <button onClick={() => toggleExpand(category.id)} className="mr-2 focus:outline-none">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              )}
              {!hasChildren && <div className="w-6"></div>}
              <span>{category.name}</span>
            </div>
          </TableCell>
          <TableCell>{category.slug}</TableCell>
          <TableCell className="text-center">{category.products}</TableCell>
          <TableCell className="text-center">
            <Switch id={`active-${category.id}`} defaultChecked={category.active} />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEditClick(category)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClick(category)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded && hasChildren && category.children.map((child: any) => renderCategoryRow(child, level + 1))}
      </>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des catégories</h1>
        <Button className="bg-[#302082] hover:bg-[#3a2a9d]" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une catégorie..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Produits</TableHead>
                <TableHead className="text-center">Actif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => renderCategoryRow(category))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Aucune catégorie trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog pour ajouter une catégorie */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une catégorie</DialogTitle>
            <DialogDescription>Créez une nouvelle catégorie pour vos produits</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input id="name" placeholder="Nom de la catégorie" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="slug-de-la-categorie" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Description de la catégorie" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Catégorie parente</Label>
              <select id="parent" className="w-full rounded-md border border-gray-300 p-2">
                <option value="">Aucune (catégorie principale)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="active" defaultChecked />
              <Label htmlFor="active">Activer la catégorie</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button className="bg-[#302082] hover:bg-[#3a2a9d]">Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier une catégorie */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>Modifiez les informations de la catégorie</DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom de la catégorie</Label>
                <Input id="edit-name" defaultValue={selectedCategory.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input id="edit-slug" defaultValue={selectedCategory.slug} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={selectedCategory.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parent">Catégorie parente</Label>
                <select
                  id="edit-parent"
                  className="w-full rounded-md border border-gray-300 p-2"
                  defaultValue={selectedCategory.parent}
                >
                  <option value="">Aucune (catégorie principale)</option>
                  {categories
                    .filter((c) => c.id !== selectedCategory.id)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-active" defaultChecked={selectedCategory.active} />
                <Label htmlFor="edit-active">Activer la catégorie</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button className="bg-[#302082] hover:bg-[#3a2a9d]">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour supprimer une catégorie */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
              {selectedCategory && selectedCategory.products > 0 && (
                <p className="text-red-500 mt-2">
                  Attention : Cette catégorie contient {selectedCategory.products} produits qui seront affectés.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive">Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
