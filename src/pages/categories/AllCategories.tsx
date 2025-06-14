import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import placeholder from "@/assets/placeholder.png";
import { useCategories } from "@/hooks/categories/useCategories";
import type { Category } from "@/types/Category";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

// Helper pour trouver la langue demandée ou fallback
function getCategoryLang(category: Category, lang = "fr") {
  return (
    category.categoryLanguages.find(l => l.code.toLowerCase() === lang.toLowerCase()) ||
    category.categoryLanguages.find(l => l.code.toLowerCase() === "fr") ||
    category.categoryLanguages[0]
  );
}

const CATEGORY_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/categories/";

export const AllCategories = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const { categories, loading, error } = useCategories();

  return (
    <div className="w-full px-2 sm:px-6 py-8 min-h-screen bg-white">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#302082] mb-4">
          {t("allCategories.title", "Toutes les catégories")}
        </h1>
        <p className="text-gray-600">
          {loading
            ? t("allCategories.loading", "Chargement...")
            : `${categories.length} ${t("allCategories.countLabel", "catégories disponibles")}`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400 text-lg">
          {t("allCategories.loading", "Chargement...")}
        </div>
      ) : error ? (
        <div className="flex justify-center py-12 text-red-500 text-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => {
            const catLang = getCategoryLang(category, language);
            const imageUrl = category.imageLink
              ? CATEGORY_IMAGE_BASE + category.imageLink
              : placeholder;

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col justify-between items-center px-8 py-10 text-center h-full min-h-[430px]"
              >
                <div>
                  <img
                    src={imageUrl}
                    alt={catLang?.name || category.name}
                    width={120}
                    height={120}
                    className="rounded-full mb-6 object-cover border-4 border-white shadow mx-auto"
                    style={{ width: 120, height: 120 }}
                    loading="lazy"
                  />
                  <h2 className="text-3xl font-extrabold mb-3">{catLang?.name || category.name}</h2>
                  <p className="text-gray-500 text-lg mb-6">
                    {catLang?.description ||
                      t("allCategories.defaultDescription", "Découvrez notre expertise.")}
                  </p>
                </div>
                <div className="flex justify-center mt-auto">
                  <Link to={`/categorie/${category.id}/produits`}>
                    <Button className="bg-[#302082] hover:bg-[#4330b5] px-8 py-2 text-white">
                      {t("allCategories.viewProducts", "Voir les produits")}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
