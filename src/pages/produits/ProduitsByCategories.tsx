import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import placeholder from "@/assets/placeholder.png";
import { useProductsByCategory } from "@/hooks/products/useProductsByCategory";
import { useCategoryId } from "@/hooks/categories/useCategoryId";

const PRODUITS_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/products/";

export const ProduitsByCategories = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProductsByCategory(id!);
  const {
    category,
    loading: categoryLoading,
    error: categoryError,
  } = useCategoryId(id!);

  return (
    <div className="w-full px-2 sm:px-6 py-8">
      {/* Bannière catégorie avec texte centré */}
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
              src={
                category?.imageLink
                  ? (category.imageLink.startsWith("http")
                      ? category.imageLink
                      : PRODUITS_IMAGE_BASE + category.imageLink)
                  : placeholder
              }
              alt={category?.name || "Catégorie"}
              className="w-full h-full object-cover object-center rounded-xl border shadow"
              loading="lazy"
              style={{ backgroundColor: "#f5f5f7" }}
            />
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
        <div className="flex justify-center py-12 text-gray-400 text-lg">Chargement des produits...</div>
      ) : error ? (
        <div className="flex justify-center py-12 text-red-500 text-lg">{error}</div>
      ) : products.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-24">
          <span className="text-gray-400 text-lg md:text-xl">
            Aucun produit trouvé dans cette catégorie.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.map((product) => {
            const frLang = product.productLangages?.find(l => l.code === "FR") || product.productLangages?.[0];
            const image = product.productImages?.[0]?.image_link
              ? (
                  product.productImages[0].image_link.startsWith("http")
                    ? product.productImages[0].image_link
                    : PRODUITS_IMAGE_BASE + product.productImages[0].image_link
                )
              : placeholder;
            const description = frLang?.description || "";
            const price = (() => {
              const subs = product.subscriptionTypes;
              if (!subs || subs.length === 0) return "-";
              const min = subs.reduce(
                (min, curr) =>
                  parseFloat(curr.price.replace(/[^\d.]/g, "")) < parseFloat(min.price.replace(/[^\d.]/g, "")) ? curr : min,
                subs[0]
              );
              return min.price;
            })();
            const inStock = product.available_stock > 0;

            return (
              <Link key={product.id} to={`/produit/${product.id}`}>
                <div className="bg-[#f7f3fb] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col min-h-[210px]">
                  <div className="aspect-square bg-gray-50 p-6 flex items-center justify-center">
                    <img
                      src={image}
                      alt={frLang?.name || `Produit ${product.id}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between px-4 py-2">
                    <h3 className="font-semibold text-center text-base mt-2 mb-1">
                      {frLang?.name || `Produit ${product.id}`}
                    </h3>
                    <div
                      className="text-xs text-gray-700 text-center mb-3"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {description}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-sm">{price}</span>
                      <span
                        className={
                          "text-xs font-semibold " +
                          (inStock ? "text-green-600" : "text-red-500")
                        }
                      >
                        {inStock ? "Disponible" : "Indisponible"}
                      </span>
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
