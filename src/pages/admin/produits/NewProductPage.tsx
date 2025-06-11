import React, { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Plus, Upload, X } from "lucide-react"
import type { ProductImage, SubscriptionType } from "../../../types/Product"

import { useCreateProduit } from "@/hooks/products/useCreateProduit"
import { useEditProduit } from "@/hooks/products/useEditProduct"
import { useProductById } from "@/hooks/products/useProductById"
import { useCategories } from "@/hooks/categories/useCategories"

const PRODUITS_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/products/"

const SUBS_TYPES = ["monthly", "yearly", "lifetime"]

export default function NewProductPage() {
  const { id: productIdParam } = useParams<{ id?: string }>()
  const productId = productIdParam ? Number(productIdParam) : null
  const { product, loading: loadingProduct, error: errorProduct } = useProductById(productId || 0)

  const { categories, loading: loadingCategories, error: errorCategories } = useCategories()

  const { create, loading: loadingCreate, error: errorCreate } = useCreateProduit()
  const { edit, loading: loadingEdit, error: errorEdit } = useEditProduit()
  const navigate = useNavigate()

  // États formulaire
  const [category, setCategory] = useState<string>("")
  const [stock, setStock] = useState<number>(0)
  const [status, setStatus] = useState<boolean>(true)

  const [productName, setProductName] = useState<string>("")
  const [productDescription, setProductDescription] = useState<string>("")

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [images, setImages] = useState<ProductImage[]>([])

  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([
    { id: Date.now(), type: "", price: "" }
  ])

  // Préremplissage des données produit quand on est en édition
  useEffect(() => {
    if (product) {
      setCategory(product.category_name || "")
      setStock(product.available_stock ?? 0)
      setStatus(product.status === "Disponible")

      const langFR = product.productLangages?.find(
        l => l.code.toLowerCase() === "fr"
      )
      if (langFR) {
        setProductName(langFR.name || "")
        setProductDescription(langFR.description || "")
      } else {
        setProductName("")
        setProductDescription("")
      }

      const processedImages = (product.productImages || []).map(img => ({
        ...img,
        image_link: img.image_link.startsWith("http")
          ? img.image_link
          : PRODUITS_IMAGE_BASE + img.image_link,
      }))
      setImages(processedImages)

      setSubscriptions(
        product.subscriptionTypes && product.subscriptionTypes.length > 0
          ? product.subscriptionTypes
          : [{ id: Date.now(), type: "", price: "" }]
      )

      setImageFiles([])
    }
  }, [product])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    setImageFiles(prev => [...prev, ...newFiles])

    const newImages = newFiles.map(file => ({
      id: Date.now() + Math.random(),
      image_link: URL.createObjectURL(file),
      name: file.name
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImageFiles(imageFiles.filter((_, i) => i !== index))
  }

  const addSubscription = () => {
    setSubscriptions([...subscriptions, { id: Date.now(), type: "", price: "" }])
  }

  const removeSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index))
  }

  const updateSubscription = (index: number, key: keyof SubscriptionType, value: string) => {
    setSubscriptions(
      subscriptions.map((sub, i) => (i === index ? { ...sub, [key]: value } : sub))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category) return
    // Trouve la catégorie par son nom français dans categories (par ex via categoryLanguages)
    const categoryObj = categories.find(cat =>
      cat.categoryLanguages?.some(lang => lang.code.toLowerCase() === "fr" && lang.name === category)
    )
    if (!categoryObj) return

    const payload = {
      name: productName,
      description: productDescription,
      lang: "fr",
      status: status ? "Disponible" : "Indisponible",
      available_stock: stock,
      category_id: categoryObj.id,
      imageFile: imageFiles.length > 0 ? imageFiles : undefined,
      subscriptionTypes: subscriptions
        .filter(sub => sub.type && sub.price)
        .map(sub => ({ type: sub.type, price: sub.price })),
    }

    try {
      if (productId) {
        await edit(productId, payload)
      } else {
        await create(payload)
      }
      navigate("/admin/produits")
    } catch (e: any) {
      console.error(e)
    }
  }

  if (loadingProduct || loadingCategories) return <p>Chargement…</p>
  if (errorProduct) return <p className="text-red-600">Erreur produit: {errorProduct}</p>
  if (errorCategories) return <p className="text-red-600">Erreur catégories: {errorCategories}</p>

  // Construire une liste de noms français uniques pour le Select
  const categoryNamesFR = categories.map(cat => {
    const langFR = cat.categoryLanguages?.find(lang => lang.code.toLowerCase() === "fr")
    return langFR ? langFR.name : cat.name
  }).filter(Boolean)

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/produits">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{productId ? "Modifier un produit" : "Ajouter un nouveau produit"}</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          </TabsList>

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
                      {categoryNamesFR.map((name, index) => (
                        <SelectItem key={index} value={name}>{name}</SelectItem>
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
                        multiple
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
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/produits">Annuler</Link>
          </Button>
          <Button
            className="bg-[#302082] hover:bg-[#3a2a9d]"
            type="submit"
            disabled={loadingCreate || loadingEdit}
          >
            {loadingCreate || loadingEdit ? (productId ? "Modification..." : "Création...") : "Enregistrer"}
          </Button>
        </div>

        {(errorCreate || errorEdit) && (
          <p className="mt-4 text-red-600">Erreur : {errorCreate || errorEdit}</p>
        )}
      </div>
    </form>
  )
}
