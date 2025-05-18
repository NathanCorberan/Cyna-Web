import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-all h-full flex flex-col items-center justify-center rounded-2xl border border-muted bg-white">
      <CardContent className="flex flex-col items-center text-center gap-4 py-8 px-6 w-full">
        <Skeleton className="h-20 w-20 rounded-full mb-2" />
        <div className="flex flex-col items-center gap-2 w-full">
          <Skeleton className="h-7 w-32" />      {/* Titre */}
          <Skeleton className="h-5 w-56" />      {/* Sous-titre */}
          <Skeleton className="h-4 w-60" />      {/* Ligne 1 texte */}
          <Skeleton className="h-4 w-44" />      {/* Ligne 2 texte */}
        </div>
      </CardContent>
    </Card>
  );
}
