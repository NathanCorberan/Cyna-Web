import { CategoryCardSkeleton } from "./CategoryCardSkeleton";

export function CategoriesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
