import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { Category } from "@/types/Category";
import { useTranslation } from "react-i18next";

interface CategoryCardProps {
  category: Category;
  lang?: string;
}

function getCategoryLang(category: Category, lang = "fr") {
  return (
    category.categoryLanguages.find(l => l.code.toLowerCase() === lang.toLowerCase()) ||
    category.categoryLanguages.find(l => l.code === "fr") ||
    category.categoryLanguages[0]
  );
}

export function CategoryCard({ category, lang = "fr" }: CategoryCardProps) {
  const { t } = useTranslation();

  const CATEGORY_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/categories/";

  const catLang = getCategoryLang(category, lang);

  return (
    <Link
      to={`/categorie/${category.id}/produits`}
      state={{
        image: CATEGORY_IMAGE_BASE + category.imageLink, 
        name: catLang?.name || category.name,
      }}
      className="block h-full"
    >
      <Card className="hover:shadow-lg transition-all h-full flex flex-col items-center justify-center rounded-2xl border border-muted bg-white">
        <CardContent className="flex flex-col items-center text-center gap-4 py-8 px-6">
          <img
            src={CATEGORY_IMAGE_BASE + category.imageLink} 
            alt={catLang?.name || category.name}
            className="h-20 w-20 rounded-full object-cover bg-muted mb-2"
            loading="lazy"
          />
          <span className="font-semibold text-lg">{catLang?.name || category.name}</span>
          <span className="text-base text-muted-foreground">
            {catLang?.description || t("home.categories.loading")}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
