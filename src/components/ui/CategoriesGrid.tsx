// src/components/ui/CategoriesGrid.tsx

import type { Category } from "@/types/Category";
import { CategoryCard } from "./CategoryCard";

interface CategoriesGridProps {
  categories: Category[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
