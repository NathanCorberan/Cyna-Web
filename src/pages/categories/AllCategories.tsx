// src/pages/categories/Categories.tsx

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import placeholder from "@/assets/placeholder.png";
import { useCategories } from "@/hooks/categories/useCategories";

// Fonctions de mapping
const getCategorySlogan = (name: string) => {
  switch (name) {
    case "SOC":
      return "SOC – Surveillez, détectez, protégez !";
    case "EDR":
      return "EDR – Une défense intelligente pour vos endpoints.";
    case "XDR":
      return "XDR – Une protection étendue, au-delà de vos endpoints.";
    default:
      return "Découvrez notre expertise.";
  }
};

const getCategoryDescription = (name: string) => {
  switch (name) {
    case "SOC":
      return "Un SOC assure une surveillance 24/7 pour identifier et neutraliser les cybermenaces avant qu'elles ne vous affectent.";
    case "EDR":
      return "L'EDR protège vos ordinateurs contre les attaques avancées grâce à la détection et la réponse automatisées.";
    case "XDR":
      return "La solution XDR offre une visibilité unifiée sur vos environnements pour une réaction rapide et efficace aux menaces.";
    default:
      return "Cette catégorie vous offre des solutions innovantes adaptées à vos besoins de sécurité.";
  }
};

export const AllCategories = () => {
  const { categories, loading, error } = useCategories();

  return (
    <div className="w-full px-2 sm:px-6 py-8 min-h-screen bg-white">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#302082] mb-4">Toutes les catégories</h1>
        <p className="text-gray-600">
          {loading ? "Chargement..." : categories.length + " catégories disponibles"}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400 text-lg">Chargement...</div>
      ) : error ? (
        <div className="flex justify-center py-12 text-red-500 text-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col justify-between items-center px-8 py-10 text-center h-full min-h-[430px]"
            >
              <div>
                <img
                  src={
                    category.imageLink
                      ? category.imageLink.startsWith("http")
                        ? category.imageLink
                        : "https://" + category.imageLink
                      : placeholder
                  }
                  alt={category.name}
                  width={120}
                  height={120}
                  className="rounded-full mb-6 object-cover border-4 border-white shadow mx-auto"
                  style={{ width: 120, height: 120 }}
                  loading="lazy"
                />
                <h2 className="text-3xl font-extrabold mb-3">{category.name}</h2>
                <h3 className="text-xl font-bold mb-4">{getCategorySlogan(category.name)}</h3>
                <p className="text-gray-500 text-lg mb-6">{getCategoryDescription(category.name)}</p>
              </div>
              <div className="flex justify-center mt-auto">
                <Link to={`/categorie/${category.id}/produits`}>
                  <Button className="bg-[#302082] hover:bg-[#4330b5] px-8 py-2 text-white">
                    Voir les produits
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
