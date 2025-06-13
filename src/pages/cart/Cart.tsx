import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/carts/useCart";
import { useCartQuantityActions } from "@/hooks/carts/useCartQuantityActions";
import { CartItem } from "@/features/cart/components/CartItem";
import { getAllTokens } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export const Cart = () => {
  const { t } = useTranslation();
  const getTokens = getAllTokens();
  const cartToken = getTokens.cartToken ?? undefined;
  const jwt = getTokens.token ?? undefined;
  const { cart, loading, error, refetch } = useCart(cartToken, jwt);
  const { increment, decrement, loadingId, error: quantityError } = useCartQuantityActions(refetch);
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (cart && cart.member) {
      const initial: { [key: number]: number } = {};
      cart.member.forEach(item => {
        initial[item.id] = item.quantity;
      });
      setQuantities(initial);
    }
  }, [cart]);

  const handleDecrement = async (id: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) - 1),
    }));
    await decrement(id);
  };

  const handleIncrement = async (id: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] ?? 1) + 1,
    }));
    await increment(id);
  };

  const getOrderIdFromCart = (cart: any) => {
    if (
      cart &&
      Array.isArray(cart.member) &&
      cart.member.length > 0 &&
      cart.member[0].order &&
      typeof cart.member[0].order["@id"] === "string"
    ) {
      return cart.member[0].order["@id"].split("/").pop();
    }
    return null;
  };

  if (!cartToken && !jwt) {
    return (
      <div className="text-center mt-10 text-gray-600">
        {t("cart.noCartFound")}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-10">
        {t("cart.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
      </div>
    );
  }

  if (!cart || !cart.member || cart.member.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("cart.title")}</h1>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">{t("cart.empty")}</p>
          <Link to="/">
            <Button className="bg-[#302082] hover:bg-[#3a2a9d]">
              {t("cart.continueShopping")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.member.reduce(
    (sum: number, item: any) => sum + parseFloat(item.unitPrice) * (quantities[item.id] ?? item.quantity),
    0
  );
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("cart.title")}</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.member.map((item: any) => (
            <CartItem
              key={item.id}
              item={item}
              quantity={quantities[item.id] ?? item.quantity}
              loadingId={loadingId}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
            />
          ))}
          {quantityError && (
            <div className="text-red-500 text-xs mt-2">{quantityError}</div>
          )}
        </div>
        <div className="md:col-span-1">
          <div className="border rounded-md p-4">
            <h2 className="font-bold text-lg mb-4">{t("cart.total")}</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>{t("cart.subtotal")}</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>{t("cart.shipping")}</span>
                <span>{shipping.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>{t("cart.total")}</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
            <Button
              className="w-full bg-[#302082] hover:bg-[#3a2a9d]"
              onClick={() => {
                const orderId = getOrderIdFromCart(cart);
                if (orderId) {
                  navigate(`/checkout/${orderId}`);
                } else {
                  alert(t("cart.noOrderFound"));
                }
              }}
            >
              {t("cart.checkout")}
            </Button>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full text-sm">
                {t("cart.payIn4x")}
              </Button>
              <Button variant="outline" className="w-full text-sm">
                {t("cart.freeShippingOver50")}
              </Button>
              <Button variant="outline" className="w-full text-sm">
                {t("cart.securePayment")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
