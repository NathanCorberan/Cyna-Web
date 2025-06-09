import React, { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Plus, Upload, X } from "lucide-react"
import { Link } from "react-router-dom"
import type { ProductLangage, ProductImage, SubscriptionType } from "../../../types/Product"

const CATEGORIES = ["SOC", "EDR", "XDR", "Accessoire", "Autre"] // À remplacer par un fetch si besoin
const SUBS_TYPES = ["monthly", "yearly", "lifetime"] // À adapter selon ton backend

export default function NewProductPage() {
  // Pour l’édition, tu peux utiliser un useEffect pour charger le produit existant par son id (si props/id dans l’url)
  // Ici, création uniquement

  // Champs principaux
  const [category, setCategory] = useState<string>("")
  const [stock, setStock] = useState<number>(0)
  const [status, setStatus] = useState<boolean>(true)

  // Gestion des langues (pour l’instant juste FR)
  const [productName, setProductName] = useState<string>("")
  const [productDescription, setProductDescription] = useState<string>("")

  // Images
  const [images, setImages] = useState<ProductImage[]>([])

  // Abonnements (SubscriptionTypes)
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([
    { id: Date.now(), type: "", price: "" }
  ])

  // Gestion SEO (optionnelle)
  const [metaTitle, setMetaTitle] = useState<string>("")
  const [metaDescription, setMetaDescription] = useState<string>("")
  const [slug, setSlug] = useState<string>("")

  // Images : Ajout/Suppression (ici simule l’upload, à remplacer par vrai upload)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    setImages([...images, { id: Date.now(), image_link: url, name: file.name }])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Subscriptions
  const addSubscription = () => {
    setSubscriptions([...subscriptions, { id: Date.now(), type: "", price: "" }])
  }

  const removeSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index))
  }

  const updateSubscription = (index: number, key: keyof SubscriptionType, value: string) => {
    setSubscriptions(
      subscriptions.map((sub, i) =>
        i === index ? { ...sub, [key]: value } : sub
      )
    )
  }

  // Soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Crée le payload pour POST/PUT selon tes types backend
    const payload = {
      available_stock: stock,
      status: status ? "Disponible" : "Indisponible",
      category_name: category,
      productLangages: [
        {
          code: "FR",
          name: productName,
          description: productDescription
        }
      ],
      productImages: images,
      subscriptionTypes: subscriptions.filter(sub => sub.type && sub.price),
      metaTitle,
      metaDescription,
      slug
    }
    // POST ou PUT ici !
    console.log("Payload:", payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Ajouter un nouveau produit</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* TAB GENERAL */}
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Entrez les informations de base du produit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Nom du produit (FR)</Label>
                  <Input
                    id="product-name"
                    placeholder="Nom du produit"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    placeholder="Description du produit"
                    rows={5}
                    value={productDescription}
                    onChange={e => setProductDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={stock}
                      onChange={e => setStock(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch id="published" checked={status} onCheckedChange={setStatus} />
                    <Label htmlFor="published">Publier le produit</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB IMAGES */}
          <TabsContent value="images" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Images du produit</CardTitle>
                <CardDescription>Ajoutez des images pour votre produit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center gap-2">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-500">Glissez-déposez des images ici ou</p>
                    <label>
                      <Button asChild variant="outline">
                        <span>Parcourir</span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-400">PNG, JPG ou GIF jusqu'à 5MB</p>
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_link}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-[#302082] text-white text-xs px-2 py-1 rounded">
                            Image principale
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB ABONNEMENTS */}
          <TabsContent value="subscriptions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Abonnements</CardTitle>
                <CardDescription>Définissez les types d’abonnement et leur prix</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscriptions.map((sub, idx) => (
                  <div key={sub.id} className="flex gap-4 items-center mb-2">
                    <Select
                      value={sub.type}
                      onValueChange={v => updateSubscription(idx, "type", v)}
                      required
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBS_TYPES.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Prix (€)"
                      type="text"
                      value={sub.price}
                      onChange={e => updateSubscription(idx, "price", e.target.value)}
                      required
                    />
                    {subscriptions.length > 1 && (
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeSubscription(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addSubscription}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un abonnement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB SEO */}
          <TabsContent value="seo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>Optimisez votre produit pour les moteurs de recherche</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Titre Meta</Label>
                  <Input
                    id="meta-title"
                    placeholder="Titre pour les moteurs de recherche"
                    value={metaTitle}
                    onChange={e => setMetaTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Description Meta</Label>
                  <Textarea
                    id="meta-description"
                    placeholder="Description pour les moteurs de recherche"
                    rows={3}
                    value={metaDescription}
                    onChange={e => setMetaDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL du produit</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      cyna.com/produits/
                    </span>
                    <Input
                      id="slug"
                      className="rounded-l-none"
                      placeholder="mon-super-produit"
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/products">Annuler</Link>
          </Button>
          <Button className="bg-[#302082] hover:bg-[#3a2a9d]" type="submit">
            Enregistrer
          </Button>
        </div>
      </div>
    </form>
  )
}
