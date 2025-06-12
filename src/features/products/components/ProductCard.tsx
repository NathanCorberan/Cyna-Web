import { Link } from "react-router-dom";
import placeholder from "@/assets/placeholder.png";
import { useLanguage } from "@/contexts/LanguageContext";

const PRODUITS_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/products/";

export function ProductCard({ product }: { product: any }) {
  const { language } = useLanguage();
  const langItem =
    product.productLangages?.find((l) => l.code.toLowerCase() === language.toLowerCase()) ||
    product.productLangages?.[0];
  const image =
    product.productImages?.[0]?.image_link
      ? PRODUITS_IMAGE_BASE + product.productImages[0].image_link
      : placeholder;
  const description = langItem?.description || "";
  const price =
    product.subscriptionTypes && product.subscriptionTypes.length > 0
      ? product.subscriptionTypes.reduce(
          (min, curr) =>
            parseFloat(curr.price.replace(/[^\d.]/g, "")) < parseFloat(min.price.replace(/[^\d.]/g, ""))
              ? curr
              : min,
          product.subscriptionTypes[0]
        ).price
      : "-";
  const inStock = product.available_stock > 0;

  return (
    <Link key={product.id} to={`/produit/${product.id}`}>
      <div className="bg-[#f7f3fb] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col min-h-[210px]">
        <div className="aspect-square bg-gray-50 p-6 flex items-center justify-center">
          <img
            src={image}
            alt={langItem?.name || `Produit ${product.id}`}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col flex-1 justify-between px-4 py-2">
          <h3 className="font-semibold text-center text-base mt-2 mb-1" data-i18n="product.name">
            {langItem?.name || `Produit ${product.id}`}
          </h3>
          <div
            className="text-xs text-gray-700 text-center mb-3"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            data-i18n="product.description"
          >
            {description}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-sm" data-i18n="product.price">{price}</span>
            <span
              className={
                "text-xs font-semibold " + (inStock ? "text-green-600" : "text-red-500")
              }
              data-i18n={inStock ? "product.available" : "product.unavailable"}
            >
              {inStock ? "Disponible" : "Indisponible"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
