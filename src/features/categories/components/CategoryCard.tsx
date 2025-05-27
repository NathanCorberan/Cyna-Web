// src/features/categories/components/CategoryCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { Category } from "@/types/Category";

// Optionnel : descriptions custom pour chaque nom de catégorie (exemple)
const descriptions: Record<string, { subtitle: string; text: string }> = {
  SOC: {
    subtitle: "SOC – Surveillez, détectez, protégez !",
    text: "Un SOC assure une surveillance 24/7 pour identifier et neutraliser les cybermenaces avant qu'elles ne vous affectent.",
  },
  XDR: {
    subtitle: "XDR – La défense avancée unifiée",
    text: "Avec XDR, bénéficiez d’une protection intelligente en connectant et analysant toutes vos sources de données pour une réponse plus rapide.",
  },
  EDR: {
    subtitle: "EDR – Sécurité maximale pour vos terminaux",
    text: "Les solutions EDR détectent, analysent et stoppent les menaces directement sur vos postes de travail et serveurs.",
  },
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Fallback pour l'image (évite les liens sans http)
  const getImageUrl = (link: string) =>
    link.startsWith("http") ? link : `https://${link}`;

  const { subtitle, text } = descriptions[category.name] ?? {
    subtitle: category.name,
    text: "",
  };

  return (
    <Link
      to={`/categorie/${category.id}/produits`}
      state={{
        image: getImageUrl(category.imageLink),
        name: category.name,
      }}
      className="block h-full"
    >
      <Card className="hover:shadow-lg transition-all h-full flex flex-col items-center justify-center rounded-2xl border border-muted bg-white">
        <CardContent className="flex flex-col items-center text-center gap-4 py-8 px-6">
          <img
            src={getImageUrl(category.imageLink)}
            alt={category.name}
            className="h-20 w-20 rounded-full object-cover bg-muted mb-2"
            loading="lazy"
          />
          <span className="font-extrabold text-2xl">{category.name}</span>
          <span className="font-semibold text-lg">{subtitle}</span>
          <span className="text-base text-muted-foreground">{text}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
