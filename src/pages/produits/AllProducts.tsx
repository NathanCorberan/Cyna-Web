import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAllProducts } from "@/hooks/products/useAllProducts";
import { ProductCard } from "@/features/products/components/ProductCard";

export const AllProducts = () => {
  const { products, loading, error } = useAllProducts();

  return (
    <div className="w-full px-2 sm:px-6 py-8 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#302082] mb-4">Tous nos Produits</h1>
        <p className="text-gray-600">{loading ? "Chargement..." : products.length + " produits disponibles"}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400 text-lg">Chargement...</div>
      ) : error ? (
        <div className="flex justify-center py-12 text-red-500 text-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-12">
        <Link to="/categories">
          <Button variant="outline" className="px-8 py-3">
            Voir par catégories
          </Button>
        </Link>
        <Link to="/">
          <Button className="px-8 py-3 bg-[#302082] hover:bg-[#3a2a9d]">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};
