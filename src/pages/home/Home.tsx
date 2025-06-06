import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/categories/useCategories";
import { CategoriesGrid } from "@/features/categories/components/CategoriesGrid";
import { CategoriesGridSkeleton } from "@/features/categories/components/CategoriesGridSkeleton";
import placeholder from "@/assets/placeholder.png";
import { useCarousels } from "@/hooks/carousel/useCarousel";
import { useTopProducts } from "@/hooks/products/useTopProducts";

export const Home = () => {
  const { categories, loading, error } = useCategories();
  const { carousels, loading: loadingCarousels, error: errorCarousels } = useCarousels();
  const { products: topProducts, loading: loadingTopProducts, error: errorTopProducts } = useTopProducts();
  const [activePanel, setActivePanel] = useState(0);

  const sortedCarousels = (carousels || []).slice().sort((a, b) => a.panel_order - b.panel_order);
  const currentCarousel = sortedCarousels[activePanel] || null;
  const frLang = currentCarousel?.carouselLangages?.find((lang) => lang.code === "FR");
  const panelsCount = sortedCarousels.length;

  const goLeft = () => setActivePanel((prev) => (prev - 1 + panelsCount) % panelsCount);
  const goRight = () => setActivePanel((prev) => (prev + 1) % panelsCount);

  return (
    <div className="w-full px-2 sm:px-6 py-8">
      <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px] rounded-lg overflow-hidden mb-10">
        {loadingCarousels ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            Chargement du carrousel...
          </div>
        ) : errorCarousels ? (
          <div className="flex items-center justify-center w-full h-full bg-red-50 text-red-600">
            {errorCarousels}
          </div>
        ) : panelsCount > 0 ? (
          <>
            <img
              src={currentCarousel?.image_link || placeholder}
              alt={frLang?.title || "Banner"}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm rounded-full"
                onClick={goLeft}
                aria-label="Slide précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm rounded-full"
                onClick={goRight}
                aria-label="Slide suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex justify-center space-x-2 absolute bottom-4 left-0 right-0 z-10">
              {sortedCarousels.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    i === activePanel ? "bg-[#302082]" : "bg-gray-300"
                  }`}
                  aria-label={`Aller au slide ${i + 1}`}
                  onClick={() => setActivePanel(i)}
                />
              ))}
            </div>
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h2 className="text-2xl font-bold text-orange-400">
                {frLang?.title || "Titre indisponible"}
              </h2>
              <p className="text-lg">{frLang?.description || "Description indisponible"}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
          </>
        ) : (
          <>
            <img
              src={placeholder}
              alt="Banner"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
          </>
        )}
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#302082]">Nouveautés</h2>
          <Link to="/nouveautes" className="text-[#302082] flex items-center hover:underline">
            Voir tout <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={placeholder + "?height=200&width=400&text=Nouveauté+1"}
                alt="Nouveauté 1"
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="absolute top-2 left-2 bg-[#302082] text-white text-xs px-2 py-1 rounded">NOUVEAU</div>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-1">12 Mai 2025</div>
              <h3 className="font-bold text-lg mb-2">Collection Été 2025</h3>
              <p className="text-gray-600 text-sm mb-3">
                Découvrez notre nouvelle collection été avec des designs exclusifs et des matières premium.
              </p>
              <Link to="/collection-ete-2025" className="text-[#302082] text-sm font-medium hover:underline">
                Découvrir la collection
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={placeholder + "?height=200&width=400&text=Nouveauté+2"}
                alt="Nouveauté 2"
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">TENDANCE</div>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-1">8 Mai 2025</div>
              <h3 className="font-bold text-lg mb-2">Accessoires Urbains</h3>
              <p className="text-gray-600 text-sm mb-3">
                Notre nouvelle gamme d'accessoires urbains pour compléter votre style quotidien.
              </p>
              <Link to="/accessoires-urbains" className="text-[#302082] text-sm font-medium hover:underline">
                Explorer la gamme
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={placeholder + "?height=200&width=400&text=Nouveauté+3"}
                alt="Nouveauté 3"
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">ÉCORESPONSABLE</div>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-1">5 Mai 2025</div>
              <h3 className="font-bold text-lg mb-2">Collection Éco-Friendly</h3>
              <p className="text-gray-600 text-sm mb-3">
                Des vêtements durables fabriqués à partir de matériaux recyclés et écoresponsables.
              </p>
              <Link to="/eco-friendly" className="text-[#302082] text-sm font-medium hover:underline">
                Voir la collection
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <CategoriesGridSkeleton />
      ) : error ? (
        <div className="mb-10 text-destructive text-center">{error}</div>
      ) : (
        <CategoriesGrid categories={categories} />
      )}

      <div className="w-full mb-10">
        <h2 className="text-xl font-bold mb-4">Top du moment</h2>
        {loadingTopProducts ? (
          <div className="text-center text-gray-500">Chargement des produits...</div>
        ) : errorTopProducts ? (
          <div className="text-destructive text-center mb-6">{errorTopProducts}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
            {topProducts.map((product) => {
              const frLang =
                product.productLangages?.find((lang) => lang.code === "FR") ||
                product.productLangages?.[0];
              const image =
                product.productImages && product.productImages.length > 0
                  ? product.productImages[0].image_link.startsWith("http")
                    ? product.productImages[0].image_link
                    : "https://" + product.productImages[0].image_link
                  : placeholder;
              const minPriceObj =
                product.subscriptionTypes &&
                product.subscriptionTypes.reduce(
                  (prev, curr) =>
                    parseFloat(curr.price.replace(/[^\d.]/g, "")) <
                    parseFloat(prev.price.replace(/[^\d.]/g, ""))
                      ? curr
                      : prev,
                  product.subscriptionTypes[0]
                );
              return (
                <Link to={`/produit/${product.id}`} key={product.id}>
                  <div className="hover:shadow-lg transition-all p-4 h-full flex flex-col items-center justify-center rounded-2xl border border-muted bg-white">
                    <div className="aspect-square bg-gray-100 w-full mb-4 flex items-center justify-center overflow-hidden rounded-lg max-w-xs">
                      <img
                        src={image}
                        alt={frLang?.name || `Produit ${product.id}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-center flex flex-col gap-1">
                      <div className="font-medium text-base">
                        {frLang?.name || `Produit ${product.id}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.category_name}
                      </div>
                      <div className="text-sm font-semibold text-[#302082]">
                        {minPriceObj ? minPriceObj.price : ""}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {frLang?.description}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
