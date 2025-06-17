import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, X } from "lucide-react"
import { useCreateCarousel } from "@/hooks/carousel/useCreateCarousel"

export default function NewCarouselSlidePage() {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [slideData, setSlideData] = useState({
    title: "",
    description: "",
    order: 1,
  })

  const { create, loading, error } = useCreateCarousel()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleInputChange = (field: keyof typeof slideData, value: string | number) => {
    setSlideData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!selectedImage) {
      alert("Veuillez ajouter une image.")
      return
    }

    try {
      await create({
        title: slideData.title,
        description: slideData.description,
        code: "fr", // ou détecté dynamiquement
        panel_order: slideData.order,
        imageFile: selectedImage,
      })
      navigate("/admin/carousel")
    } catch (err) {
      console.error("Erreur lors de la création du carousel :", err)
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" type="button" onClick={() => navigate("/admin/carousel")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Ajouter une slide au carousel</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Télécharger une image</p>
                    <p className="text-sm text-gray-500">Cliquez pour parcourir</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP jusqu'à 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Ex: Collection Été 2025"
              value={slideData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description détaillée de la slide"
              rows={4}
              value={slideData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">Ordre d'affichage</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={slideData.order}
              onChange={(e) => handleInputChange("order", parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600 text-right">{error}</p>}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/admin/carousel")}>Annuler</Button>
        <Button
          className="bg-[#302082] hover:bg-[#3a2a9d]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  )
}
