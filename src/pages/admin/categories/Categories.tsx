import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
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
import { useCategories } from "@/hooks/categories/useCategories"
import { useCreateCategory } from "@/hooks/categories/useCreateCategory"
import { useDeleteCategory } from "@/hooks/categories/useDeleteCategory"
import { useEditCategory } from "@/hooks/categories/useEditCategory"
import type { Category } from "@/types/Category"

const CATEGORY_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/categories/"
const DEFAULT_IMAGE = ""

// --- Utilitaire pour télécharger une image existante en File
async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], filename, { type: data.type });
}

function getCategoryImageUrl(category: Category) {
  if (!category.imageLink) return "";
  if (
    category.imageLink.startsWith("http://") ||
    category.imageLink.startsWith("https://") ||
    category.imageLink.startsWith("//")
  ) {
    return category.imageLink;
  }
  if (category.imageLink.startsWith("/assets/images/categories/")) {
    return "http://srv839278.hstgr.cloud:8000" + category.imageLink;
  }
  return CATEGORY_IMAGE_BASE + category.imageLink.replace(/^\/+/, "");
}

function getCategoryDescription(category: Category, lang = "fr") {
  if (!category.categoryLanguages || !Array.isArray(category.categoryLanguages)) return ""
  const found = category.categoryLanguages.find((l) => l.code?.toLowerCase() === lang.toLowerCase())
  return found?.description || ""
}

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  // Formulaires
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    lang: "fr",
    category_order: 1,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    lang: "fr",
    category_order: 1,
  });

  // Hooks API
  const { categories, loading, error, refetch } = useCategories()
  const { create, loading: loadingCreate, error: errorCreate } = useCreateCategory()
  const { remove, loading: loadingDelete, error: errorDelete } = useDeleteCategory();
  const { edit, loading: loadingEdit, error: errorEdit } = useEditCategory();

  // Reset formulaire + image
  const resetAddForm = () => {
    setAddForm({ name: "", description: "", lang: "fr", category_order: 1 });
    resetImageStates();
  }
  const resetEditForm = () => {
    setEditForm({ name: "", description: "", lang: "fr", category_order: 1 });
    resetImageStates();
  }

  // Gestion d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }
  const resetImageStates = () => {
    setSelectedImage(null)
    setImagePreview("")
  }

  // Ouvre la modale d'édition et préremplit
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setShowEditDialog(true)
  }
  // Ouvre la modale suppression
  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }

  // Préremplir formulaire édition à l'ouverture du dialog
  useEffect(() => {
    if (showEditDialog && selectedCategory) {
      setEditForm({
        name: selectedCategory.name,
        description: getCategoryDescription(selectedCategory, "fr"),
        lang: "fr",
        category_order: selectedCategory.category_order || 1,
      });
      resetImageStates();
    }
  }, [showEditDialog, selectedCategory]);

  // Recherche sur les catégories de premier niveau uniquement (tu peux changer si besoin)
  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Rendu d'une ligne catégorie
  const renderCategoryRow = (category: Category, level = 0) => {
    return (
      <TableRow key={category.id}>
        <TableCell>
          {category.imageLink && (
            <img
              src={getCategoryImageUrl(category)}
              alt={category.name}
              className="w-10 h-10 object-cover rounded"
              style={{ background: "#eee" }}
            />
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            <span>{category.name}</span>
          </div>
        </TableCell>
        <TableCell className="max-w-[240px] truncate">
          {getCategoryDescription(category, "fr")}
        </TableCell>
        <TableCell className="text-center">{category.nbProducts ?? 0}</TableCell>
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
    )
  }

  // ---- LOGIQUE DE SOUMISSION (AJOUTER UNE CATÉGORIE) ----
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addForm.name.trim()) return alert("Nom obligatoire");
    if (!addForm.description.trim()) return alert("Description obligatoire");
    if (!addForm.category_order) return alert("Ordre obligatoire");

    const toSend = {
      name: addForm.name,
      description: addForm.description,
      lang: addForm.lang,
      category_order: addForm.category_order,
      imageFile: selectedImage,
    };

    try {
      await create(toSend);
      resetAddForm();
      setShowAddDialog(false);
      if (refetch) refetch();
    } catch (err) {
      // déjà géré
    }
  }

  // ---- LOGIQUE DE SOUMISSION (EDITER UNE CATÉGORIE) ----
  const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;
    if (!editForm.name.trim()) return alert("Nom obligatoire");
    if (!editForm.description.trim()) return alert("Description obligatoire");
    if (!editForm.category_order) return alert("Ordre obligatoire");

    const toSend: any = {
      name: editForm.name,
      description: editForm.description,
      lang: editForm.lang,
      category_order: editForm.category_order,
    };
    if (selectedImage) {
      toSend.imageFile = selectedImage;
    } else if (selectedCategory.imageLink) {
      const url = getCategoryImageUrl(selectedCategory);
      const file = await urlToFile(url, selectedCategory.imageLink.split('/').pop() || "image.jpg");
      toSend.imageFile = file;
    }
    try {
      await edit(selectedCategory.id, toSend);
      setShowEditDialog(false);
      setSelectedCategory(null);
      if (refetch) refetch();
    } catch (err) {
      // error affichée par le hook
    }
  };

  // --- RENDU ---
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
                <TableHead>Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Produits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-red-500">
                    Erreur : {error}
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Aucune catégorie trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category: Category) => renderCategoryRow(category))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog pour ajouter une catégorie */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) resetAddForm()
        }}
      >
        <DialogContent className="bg-white shadow-xl rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une catégorie</DialogTitle>
            <DialogDescription>Créez une nouvelle catégorie pour vos produits</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCategory}>
            <div className="space-y-4 py-4">
              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="add-image">Image de la catégorie</Label>
                <div className="space-y-3">
                  <Input
                    id="add-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                      <img src={imagePreview || DEFAULT_IMAGE} alt="Aperçu" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={resetImageStates}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  placeholder="Nom de la catégorie"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description de la catégorie"
                  value={addForm.description}
                  onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              {/* Ordre */}
              <div className="space-y-2">
                <Label htmlFor="category_order">Ordre de la catégorie</Label>
                <Input
                  id="category_order"
                  type="number"
                  min={1}
                  placeholder="Ordre"
                  value={addForm.category_order}
                  onChange={e => setAddForm(f => ({
                    ...f,
                    category_order: Number(e.target.value)
                  }))}
                />
              </div>
              {/* Langue */}
              <div className="space-y-2">
                <Label htmlFor="add-lang">Langue</Label>
                <select
                  id="add-lang"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={addForm.lang}
                  onChange={e => setAddForm(f => ({ ...f, lang: e.target.value }))}
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                </select>
              </div>
              {errorCreate && <div className="text-red-500 text-sm">{errorCreate}</div>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowAddDialog(false)}
                disabled={loadingCreate}
              >
                Annuler
              </Button>
              <Button
                className="bg-[#302082] hover:bg-[#3a2a9d]"
                type="submit"
                disabled={loadingCreate}
              >
                {loadingCreate ? "Ajout..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier une catégorie */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open)
          if (!open) {
            resetEditForm()
            setSelectedCategory(null)
          }
        }}
      >
        <DialogContent className="bg-white shadow-xl rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>Modifiez les informations de la catégorie</DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <form onSubmit={handleEditCategory}>
              <div className="space-y-4 py-4">
                {/* Image */}
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Image de la catégorie</Label>
                  <div className="space-y-3">
                    {selectedCategory.imageLink && !imagePreview && (
                      <div className="relative w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                        <img
                          src={getCategoryImageUrl(selectedCategory)}
                          alt="Image actuelle"
                          className="w-full h-full object-cover"
                          onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                          Image actuelle
                        </div>
                      </div>
                    )}
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="relative w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                        <img
                          src={imagePreview || DEFAULT_IMAGE}
                          alt="Nouvelle image"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={resetImageStates}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-green-500 bg-opacity-75 text-white text-xs p-1 text-center">
                          Nouvelle image
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nom de la catégorie</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                {/* Ordre */}
                <div className="space-y-2">
                  <Label htmlFor="edit-order">Ordre de la catégorie</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    min={1}
                    value={editForm.category_order}
                    onChange={e => setEditForm(f => ({
                      ...f,
                      category_order: Number(e.target.value)
                    }))}
                  />
                </div>
                {/* Langue */}
                <div className="space-y-2">
                  <Label htmlFor="edit-lang">Langue</Label>
                  <select
                    id="edit-lang"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={editForm.lang}
                    onChange={e => setEditForm(f => ({ ...f, lang: e.target.value }))}
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                  </select>
                </div>
                {errorEdit && <div className="text-red-500 text-sm">{errorEdit}</div>}
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowEditDialog(false)}>
                  Annuler
                </Button>
                <Button className="bg-[#302082] hover:bg-[#3a2a9d]" type="submit" disabled={loadingEdit}>
                  {loadingEdit ? "Mise à jour..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour supprimer une catégorie */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
              {selectedCategory && selectedCategory.nbProducts > 0 && (
                <p className="text-red-500 mt-2">
                  Attention : Cette catégorie contient {selectedCategory.nbProducts} produits qui seront affectés.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={loadingDelete || !selectedCategory}
              onClick={async () => {
                if (!selectedCategory) return;
                try {
                  await remove(selectedCategory.id);
                  setShowDeleteDialog(false);
                  setSelectedCategory(null);
                  if (refetch) refetch();
                } catch (e) {
                  // L’erreur est déjà affichée
                }
              }}
            >
              {loadingDelete ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
          {errorDelete && (
            <div className="text-red-500 text-sm mt-2">{errorDelete}</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
