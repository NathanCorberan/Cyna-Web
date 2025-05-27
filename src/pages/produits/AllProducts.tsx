import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import placeholder from "@/assets/placeholder.png";
import { useAllProducts } from "@/hooks/products/useAllProducts";

export const AllProducts = () => {
  const { products, loading, error } = useAllProducts();

  const getImageUrl = (img?: string) =>
    img
      ? img.startsWith("http")
        ? img
        : `https://${img}`
      : placeholder;

  const getPrice = (subs: any[]) => {
    if (!subs || subs.length === 0) return "-";
    const min = subs.reduce(
      (min, curr) =>
        parseFloat(curr.price.replace(/[^\d.]/g, "")) < parseFloat(min.price.replace(/[^\d.]/g, ""))
          ? curr
          : min,
      subs[0]
    );
    return min.price;
  };

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
          {products.map((product) => {
            const frLang = product.productLangages?.find(l => l.code === "FR") || product.productLangages?.[0];
            const image = product.productImages?.[0]?.image_link
              ? getImageUrl(product.productImages[0].image_link)
              : placeholder;
            const description = frLang?.description || "";
            const price = getPrice(product.subscriptionTypes);
            const inStock = product.available_stock > 0;
            return (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="bg-[#f7f3fb] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col min-h-[210px]">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center">
                    <img
                      src={image}
                      alt={frLang?.name || product.id.toString()}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between px-4 py-2">
                    <h3 className="font-semibold text-center text-base mt-2 mb-1">{frLang?.name || `Produit ${product.id}`}</h3>
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
