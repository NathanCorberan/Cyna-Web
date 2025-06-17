import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCarousels } from "@/hooks/carousel/useCarousel"
import type { Carousel, Slide } from "@/types/Carousel"

const placeholder = "/placeholder.svg"
const CAROUSEL_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/carousel/"

// ... (imports identiques)

export default function AdminCarousel() {
  const navigate = useNavigate()
  const { carousels, loading, error } = useCarousels()
  const [slides, setSlides] = useState<Slide[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)

  useEffect(() => {
    const mapped: Slide[] = carousels.map((carousel: Carousel) => {
      const fr = carousel.carouselLangages.find((l) => l.code === "fr")
      return {
        id: carousel.id,
        title: fr?.title ?? "Titre manquant",
        description: fr?.description ?? "",
        image: carousel.image_link,
        active: true,
        order: carousel.panel_order,
      }
    })
    setSlides(mapped)
  }, [carousels])

  const activeSlides = slides.filter((s) => s.active)
  const current = activeSlides[activeIndex] || ({} as Slide)

  const goLeft = () => setActiveIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  const goRight = () => setActiveIndex((prev) => (prev + 1) % activeSlides.length)

  const deleteSlide = (id: number) => setSlides((prev) => prev.filter((s) => s.id !== id))

  const moveSlide = (id: number, direction: "up" | "down") => {
    const index = slides.findIndex((s) => s.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === slides.length - 1)) return
    const newSlides = [...slides]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]]
    setSlides(newSlides.map((s, i) => ({ ...s, order: i + 1 })))
  }

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <div className="w-full px-4 py-6 space-y-10 max-w-screen-xl mx-auto">
      {/* CAROUSEL */}
      <div className="relative w-full rounded-lg overflow-hidden h-[200px] sm:h-[280px] md:h-[340px]">
        {activeSlides.length > 0 ? (
          <>
            <img
              src={CAROUSEL_IMAGE_BASE + current.image}
              alt={current.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-between px-3 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/40 hover:bg-black/50 text-white rounded-full"
                onClick={goLeft}
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/40 hover:bg-black/50 text-white rounded-full"
                onClick={goRight}
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white z-30">
              <h2 className="text-base sm:text-xl font-bold text-orange-400">{current.title}</h2>
              <p className="text-sm sm:text-base">{current.description}</p>
            </div>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-30">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 w-5 rounded-full ${i === activeIndex ? "bg-white" : "bg-white/40"}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <img src={placeholder} alt="Banner" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
          </>
        )}
      </div>

      {/* SLIDES TABLE */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-lg sm:text-2xl font-bold">Slides du Carousel</h2>
          <Button
            className="bg-[#302082] hover:bg-[#3a2a9d] w-full sm:w-auto"
            onClick={() => navigate("/admin/carousel/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une slide
          </Button>
        </div>

        <div className="space-y-4">
          {slides.sort((a, b) => a.order - b.order).map((slide, index) => (
            <div
              key={slide.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="w-full sm:w-24 h-36 sm:h-16 bg-gray-100 rounded overflow-hidden">
                <img src={CAROUSEL_IMAGE_BASE + slide.image} alt={slide.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{slide.title}</h3>
                <p className="text-sm text-gray-600 truncate">{slide.description}</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveSlide(slide.id, "up")} disabled={index === 0}>
                  ↑
                </Button>
                <span className="text-xs">{slide.order}</span>
                <Button variant="ghost" size="sm" onClick={() => moveSlide(slide.id, "down")} disabled={index === slides.length - 1}>
                  ↓
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteSlide(slide.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-10 w-10 mx-auto mb-2" />
              <p>Aucune slide créée</p>
              <p className="text-sm">Cliquez sur "Ajouter une slide" pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
