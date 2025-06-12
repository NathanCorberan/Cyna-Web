import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/categories/useCategories";
import { CategoriesGrid } from "@/features/categories/components/CategoriesGrid";
import { CategoriesGridSkeleton } from "@/features/categories/components/CategoriesGridSkeleton";
import placeholder from "@/assets/placeholder.png";
import { useCarousels } from "@/hooks/carousel/useCarousel";
import { useTopProducts } from "@/hooks/products/useTopProducts";
import { useTranslation } from "react-i18next";

const PRODUITS_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/products/";

function ProductCard({ product }: { product: any }) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const langItem =
    product.productLangages?.find((l) => l.code.toLowerCase() === language.toLowerCase()) ||
    product.productLangages?.[0];
  const image =
    product.productImages?.[0]?.image_link
      ? PRODUITS_IMAGE_BASE + product.productImages[0].image_link
      : placeholder;
  const description = langItem?.description || "";
  const price =
    product.subscriptionTypes && product.subscriptionTypes.length > 0
      ? product.subscriptionTypes.reduce(
          (min, curr) =>
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
              <p className="text-lg">{langCarousel?.description || t("home.carousel.descriptionUnavailable")}</p>
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

      {/* CATÉGORIES */}
      {loading ? (
        <CategoriesGridSkeleton />
      ) : error ? (
        <div className="mb-10 text-destructive text-center">{t("home.categories.error")}</div>
      ) : (
        <CategoriesGrid categories={categories} lang={language} />
      )}

      {/* TOP DU MOMENT */}
      <div className="w-full mb-10">
        <h2 className="text-xl font-bold mb-4">{t("home.topProducts.title")}</h2>
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
