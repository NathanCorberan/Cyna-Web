import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/categories/useCategories";
import { CategoriesGrid } from "@/features/categories/components/CategoriesGrid";
import { CategoriesGridSkeleton } from "@/features/categories/components/CategoriesGridSkeleton";
import placeholder from "@/assets/placeholder.png";
import { useCarousels } from "@/hooks/carousel/useCarousel";
import { useTopProducts } from "@/hooks/products/useTopProducts";
import { useTranslation } from "react-i18next";

import type { Product, ProductLangage, SubscriptionType } from "@/types/Product";

const PRODUITS_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/products/";

function ProductCard({ product }: { product: Product }) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const langItem: ProductLangage | undefined =
    product.productLangages.find(
      (l: ProductLangage) => l.code.toLowerCase() === language.toLowerCase()
    ) || product.productLangages[0];

  const image =
    product.productImages?.[0]?.image_link
      ? PRODUITS_IMAGE_BASE + product.productImages[0].image_link
      : placeholder;

  const description = langItem?.description || "";

  const price: string =
    product.subscriptionTypes && product.subscriptionTypes.length > 0
      ? product.subscriptionTypes.reduce(
          (min: SubscriptionType, curr: SubscriptionType) =>
            parseFloat(curr.price.replace(/[^\d.]/g, "")) <
            parseFloat(min.price.replace(/[^\d.]/g, ""))
              ? curr
              : min,
          product.subscriptionTypes[0]
        ).price
      : "-";

  const inStock = product.available_stock > 0;

  return (
    <Link key={product.id} to={`/produit/${product.id}`}>
      <div className="bg-[#f7f3fb] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col min-h-[210px]">
        <div className="aspect-square bg-gray-50 p-6 flex items-center justify-center">
          <img
            src={image}
            alt={langItem?.name || `Produit ${product.id}`}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col flex-1 justify-between px-4 py-2">
          <h3 className="font-semibold text-center text-base mt-2 mb-1">
            {langItem?.name || `Produit ${product.id}`}
          </h3>
          <div
            className="text-xs text-gray-700 text-center mb-3"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-sm">{price}</span>
            <span
              className={
                "text-xs font-semibold " + (inStock ? "text-green-600" : "text-red-500")
              }
            >
              {inStock ? t("home.topProducts.available") : t("home.topProducts.unavailable")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const Home = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const { categories, loading, error } = useCategories();
  const { carousels, loading: loadingCarousels, error: errorCarousels } = useCarousels();
  const { products: topProducts, loading: loadingTopProducts, error: errorTopProducts } = useTopProducts();
  const [activePanel, setActivePanel] = useState(0);

  const sortedCarousels = (carousels || []).slice().sort((a, b) => a.panel_order - b.panel_order);
  const currentCarousel = sortedCarousels[activePanel] || null;
  const langCarousel = currentCarousel?.carouselLangages?.find(
    (lang) => lang.code.toLowerCase() === language.toLowerCase()
  );
  const panelsCount = sortedCarousels.length;

  const goLeft = () => setActivePanel((prev) => (prev - 1 + panelsCount) % panelsCount);
  const goRight = () => setActivePanel((prev) => (prev + 1) % panelsCount);

  return (
    <div className="w-full px-2 sm:px-6 py-8">
      {/* CAROUSEL */}
      <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px] rounded-lg overflow-hidden mb-10">
        {loadingCarousels ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            {t("home.carousel.loading")}
          </div>
        ) : errorCarousels ? (
          <div className="flex items-center justify-center w-full h-full bg-red-50 text-red-600">
            {t("home.carousel.error")}
          </div>
        ) : panelsCount > 0 ? (
          <>
            <img
              src={currentCarousel?.image_link || placeholder}
              alt={langCarousel?.title || t("home.carousel.titleUnavailable")}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm rounded-full"
                onClick={goLeft}
                aria-label={t("home.carousel.slidePrevious")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm rounded-full"
                onClick={goRight}
                aria-label={t("home.carousel.slideNext")}
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
                  aria-label={t("home.carousel.goToSlide", { number: i + 1 })}
                  onClick={() => setActivePanel(i)}
                />
              ))}
            </div>
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h2 className="text-2xl font-bold text-orange-400">
                {langCarousel?.title || t("home.carousel.titleUnavailable")}
              </h2>
              <p className="text-lg">
                {langCarousel?.description || t("home.carousel.descriptionUnavailable")}
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
          </>
        ) : (
          <>
            <img src={placeholder} alt="Banner" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
          </>
        )}
      </div>

      {/* NOUVEAUTÉS */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#302082]">{t("home.newProducts.title", "Nouveautés")}</h2>
          <Link to="/nouveautes" className="text-[#302082] flex items-center hover:underline">
            {t("home.newProducts.viewAll", "Voir tout")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={placeholder + "?height=200&width=400&text=Nouveauté+1"}
                alt={t("home.newProducts.item1.alt", "Nouveauté 1")}
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="absolute top-2 left-2 bg-[#302082] text-white text-xs px-2 py-1 rounded">
                {t("home.newProducts.item1.label", "NOUVEAU")}
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-1">12 Mai 2025</div>
              <h3 className="font-bold text-lg mb-2">{t("home.newProducts.item1.title", "Collection Été 2025")}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {t(
                  "home.newProducts.item1.description",
                  "Découvrez notre nouvelle collection été avec des designs exclusifs et des matières premium."
                )}
              </p>
              <Link to="/collection-ete-2025" className="text-[#302082] text-sm font-medium hover:underline">
                {t("home.newProducts.item1.linkText", "Découvrir la collection")}
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={placeholder + "?height=200&width=400&text=Nouveauté+2"}
                alt={t("home.newProducts.item2.alt", "Nouveauté 2")}
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                {t("home.newProducts.item2.label", "TENDANCE")}
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-1">8 Mai 2025</div>
              <h3 className="font-bold text-lg mb-2">{t("home.newProducts.item2.title", "Accessoires Urbains")}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {t(
                  "home.newProducts.item2.description",
                  "Notre nouvelle gamme d'accessoires urbains pour compléter votre style quotidien."
                )}
              </p>
              <Link to="/accessoires-urbains" className="text-[#302082] text-sm font-medium hover:underline">
                {t("home.newProducts.item2.linkText", "Explorer la gamme")}
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={placeholder + "?height=200&width=400&text=Nouveauté+3"}
                alt={t("home.newProducts.item3.alt", "Nouveauté 3")}
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                {t("home.newProducts.item3.label", "ÉCORESPONSABLE")}
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-1">5 Mai 2025</div>
              <h3 className="font-bold text-lg mb-2">{t("home.newProducts.item3.title", "Collection Éco-Friendly")}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {t(
                  "home.newProducts.item3.description",
                  "Des vêtements durables fabriqués à partir de matériaux recyclés et écoresponsables."
                )}
              </p>
              <Link to="/eco-friendly" className="text-[#302082] text-sm font-medium hover:underline">
                {t("home.newProducts.item3.linkText", "Voir la collection")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CATÉGORIES */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#302082]">{t("home.categories.title", "Catégories")}</h2>
          <Link to="/categories" className="text-[#302082] flex items-center hover:underline">
            {t("home.categories.viewAll", "Voir tout")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <CategoriesGridSkeleton />
        ) : error ? (
          <div className="mb-10 text-destructive text-center">{error}</div>
        ) : (
          <CategoriesGrid categories={categories} lang={language} />
        )}
      </div>

      {/* TOP DU MOMENT */}
      <div className="w-full mb-10">
        <h2 className="text-2xl font-bold text-[#302082]">{t("home.topProducts.title")}</h2>
        {loadingTopProducts ? (
          <div className="text-center text-gray-500">{t("home.topProducts.loading")}</div>
        ) : errorTopProducts ? (
          <div className="text-destructive text-center mb-6">{t("home.topProducts.error")}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
            {topProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
