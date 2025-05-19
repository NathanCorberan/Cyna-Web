import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/categories/useCategories";
import { CategoriesGrid } from "@/features/categories/components/CategoriesGrid";
import { CategoriesGridSkeleton } from "@/features/categories/components/CategoriesGridSkeleton";

// (optionnel) : Pour un skeleton shadcn, tu peux ajouter import { Skeleton } from "@/components/ui/skeleton";

export const Home = () => {
  const { categories, loading, error } = useCategories();

  return (
    <div className="w-full px-2 sm:px-6 py-8">
      <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px] rounded-lg overflow-hidden mb-10">
        <img
          src="/placeholder.svg?height=380&width=1400"
          alt="Banner"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
          <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-sm rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-sm rounded-full">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex justify-center space-x-2 absolute bottom-4 left-0 right-0 z-10">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full ${i === 0 ? "bg-[#302082]" : "bg-gray-300"}`} />
          ))}
        </div>

        <div className="absolute bottom-8 left-8 text-white z-10">
          <h2 className="text-2xl font-bold text-orange-400">Nom catégorie 1</h2>
          <p className="text-lg">Description catégorie 1</p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Section Catégories */}
      {loading ? (
        <CategoriesGridSkeleton />
      ) : error ? (
        <div className="mb-10 text-destructive text-center">{error}</div>
      ) : (
        <CategoriesGrid categories={categories} />
      )}


      <div className="w-full mb-10">
        <h2 className="text-xl font-bold mb-4">Top du moment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Link to={`/produit-${i + 1}`} key={i}>
              <div className="border rounded-xl p-4 hover:shadow-lg transition-shadow bg-white flex flex-col items-center">
                <div className="aspect-square bg-gray-100 w-full mb-4 flex items-center justify-center overflow-hidden rounded-lg max-w-xs">
                  <img
                    src="/placeholder.svg?height=300&width=300"
                    alt={`Produit ${i + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-center">
                  <div className="font-medium text-base">Produit {i + 1}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
