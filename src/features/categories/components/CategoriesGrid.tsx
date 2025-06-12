import type { Category } from "@/types/Category";
import { CategoryCard } from "./CategoryCard";

interface CategoriesGridProps {
  categories: Category[];
  lang: string; // on attend la langue
}

export function CategoriesGrid({ categories, lang }: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} lang={lang} />
      ))}
    </div>
  );
}
