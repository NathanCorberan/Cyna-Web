import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import placeholder from "@/assets/placeholder.png";
import { useProductById } from "@/hooks/products/useProductById";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CartOrderItem } from "@/types/Cart";

const PRODUITS_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/products/";

interface CartItemProps {
  item: CartOrderItem;
  quantity: number;
  loadingId: number | null;
  onDecrement: (id: number) => void | Promise<void>;
  onIncrement: (id: number) => void | Promise<void>;
}

export function CartItem({ item, quantity, loadingId, onDecrement, onIncrement }: CartItemProps) {
  const productId = item.product.replace("/api/products/", "");
  const { product } = useProductById(productId);
  const { language } = useLanguage();

  const langItem = product?.productLangages?.find(l => l.code.toLowerCase() === language.toLowerCase()) ||
    product?.productLangages?.[0];
  const image = product?.productImages?.[0]?.image_link
    ? PRODUITS_IMAGE_BASE + product.productImages[0].image_link
    : placeholder;
  const productName = langItem?.name || `Produit ${productId}`;

  return (
    <div className="border rounded-md p-4 flex items-center gap-4">
      <div className="w-20 h-20 bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden rounded">
        <img
          src={image}
          alt={productName}
          width={80}
          height={80}
          className="object-cover"
          style={{ width: 80, height: 80 }}
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium">{productName}</h3>
        <div className="text-sm text-gray-500 mt-1">{parseFloat(item.unitPrice).toFixed(2)} €</div>
      </div>
      <div className="flex items-center border rounded-md bg-white px-1 py-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => onDecrement(item.id)}
          disabled={loadingId === item.id}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <input
          type="number"
          value={quantity}
          className="w-8 h-8 appearance-none bg-transparent text-center text-black border-none outline-none focus:ring-0 focus-visible:ring-0"
          min="1"
          readOnly
          style={{ margin: 0, padding: 0 }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => onIncrement(item.id)}
          disabled={loadingId === item.id}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-right font-medium w-20">
        {(parseFloat(item.unitPrice) * quantity).toFixed(2)} €
      </div>
    </div>
  );
}