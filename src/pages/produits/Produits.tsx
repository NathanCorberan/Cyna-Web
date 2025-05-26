import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import placeholder from "@/assets/placeholder.png";
import { useProductsByCategory } from "@/hooks/products/useProductsByCategory";
import { useCategoryId } from "@/hooks/categories/useCategoryId";

export const Produit = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProductsByCategory(id!);

  const {
    category,
    loading: categoryLoading,
    error: categoryError,
  } = useCategoryId(id!);

  const getImageUrl = (link?: string) =>
    link
      ? link.startsWith("http")
        ? link
        : `https://${link}`
      : placeholder;

  return (
    <div className="w-full px-2 sm:px-6 py-8">
      {/* Bannière image catégorie AVEC texte centré */}
      <div className="max-w-6xl mx-auto mb-8 relative h-[200px] flex items-center justify-center">
        {categoryLoading ? (
          <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 animate-pulse">
            Chargement de la catégorie...
          </div>
        ) : categoryError ? (
          <div className="w-full h-full rounded-xl bg-red-50 flex items-center justify-center text-red-400">
            {categoryError}
          </div>
        ) : (
          <>
            <img
              src={getImageUrl(category?.imageLink)}
              alt={category?.name || "Catégorie"}
              className="w-full h-full object-cover object-center rounded-xl border shadow"
              loading="lazy"
              style={{ backgroundColor: "#f5f5f7" }}
            />
            {/* Overlay sombre et texte centré */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className="text-3xl md:text-4xl font-bold drop-shadow-lg bg-black/40 px-6 py-2 rounded-xl"
                    style={{ color: "#fa9917" }}
                >
                    {category?.name}
                </span>
            </div>
          </>
        )}
      </div>

      {/* Titre + bouton retour */}
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#302082] flex items-center gap-2">
          <PackageOpen className="w-7 h-7 text-[#302082]" /> Produits de la catégorie
        </h1>
        <Link to="/categories">
          <Button variant="outline" className="flex items-center gap-2 px-6 py-3">
            <ArrowLeft className="w-4 h-4" /> Retour aux catégories
          </Button>
        </Link>
      </div>

      {/* Grille produits */}
      {loading ? (
        <div className="text-center text-gray-400 my-20">Chargement des produits...</div>
      ) : error ? (
        <div className="text-center text-red-500 my-20">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.length === 0 && (
            <div className="col-span-full text-center text-gray-500">Aucun produit trouvé dans cette catégorie.</div>
          )}
          {products.map((product) => {
            const frLang = product.productLangages?.find(l => l.code === "FR") || product.productLangages?.[0];
            const image =
              product.productImages?.[0]?.image_link
                ? product.productImages[0].image_link.startsWith("http")
                  ? product.productImages[0].image_link
                  : "https://" + product.productImages[0].image_link
                : placeholder;
            return (
              <Link to={`/product/${product.id}`} key={product.id}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                  <div className="aspect-square bg-gray-50 p-6 flex items-center justify-center">
                    <img
                      src={image}
                      alt={frLang?.name || `Produit ${product.id}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="p-6 text-center flex flex-col gap-2 flex-1">
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{frLang?.name || `Produit ${product.id}`}</h3>
                    <div className="flex flex-col items-center gap-1 mb-1">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          product.available_stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.available_stock > 0 ? "En stock" : "Rupture de stock"}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {product.available_stock > 0
                          ? `${product.available_stock} en stock`
                          : "Indisponible"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{frLang?.description}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
