import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/carts/useCart";
import { useCartQuantityActions } from "@/hooks/carts/useCartQuantityActions";
import placeholder from "@/assets/placeholder.png";
import { getAllTokens } from "@/lib/utils";

export const Cart = () => {
    const getTokens = getAllTokens();
    const cartToken = getTokens.cartToken ?? undefined;
    const jwt = getTokens.token ?? undefined;
    const { cart, loading, error, refetch } = useCart(cartToken, jwt);
    const { increment, decrement, loadingId, error: quantityError } = useCartQuantityActions(refetch);
    const navigate = useNavigate();

    // Quantités locales pour affichage instantané UX
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

    // Appelle l'API et met à jour la quantité locale instantanément
    const handleDecrement = async (id: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] ?? 1) - 1), // UX : toujours >= 1 en local, mais l'API peut delete
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

    // Fonction pour extraire l'orderId du panier
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
                Aucun panier trouvé.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center mt-10">
                Chargement du panier...
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
                <h1 className="text-2xl font-bold mb-6">Mon panier</h1>
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Votre panier est vide</p>
                    <Link to="/">
                        <Button className="bg-[#302082] hover:bg-[#3a2a9d]">
                            Continuer mes achats
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Calcul des totaux avec la quantité locale
    const subtotal = cart.member.reduce(
        (sum: number, item: any) => sum + parseFloat(item.unitPrice) * (quantities[item.id] ?? item.quantity),
        0
    );
    const shipping = 4.99;
    const total = subtotal + shipping;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Mon panier</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    {cart.member.map((item: any) => (
                        <div key={item.id} className="border rounded-md p-4 flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden rounded">
                                <img
                                    src={placeholder}
                                    alt={`Produit ${item.product.replace("/api/products/", "")}`}
                                    width={80}
                                    height={80}
                                    className="object-cover"
                                    style={{ width: 80, height: 80 }}
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-medium">{`Produit ${item.product.replace("/api/products/", "")}`}</h3>
                                <div className="text-sm text-gray-500 mt-1">{parseFloat(item.unitPrice).toFixed(2)} €</div>
                            </div>
                            {/* Bloc quantité centré */}
                            <div className="flex items-center border rounded-md bg-white px-1 py-0">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleDecrement(item.id)}
                                    disabled={loadingId === item.id}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <input
                                    type="number"
                                    value={quantities[item.id] ?? item.quantity}
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
                                    onClick={() => handleIncrement(item.id)}
                                    disabled={loadingId === item.id}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-right font-medium w-20">
                                {(parseFloat(item.unitPrice) * (quantities[item.id] ?? item.quantity)).toFixed(2)} €
                            </div>
                        </div>
                    ))}
                    {quantityError && (
                        <div className="text-red-500 text-xs mt-2">{quantityError}</div>
                    )}
                </div>
                <div className="md:col-span-1">
                    <div className="border rounded-md p-4">
                        <h2 className="font-bold text-lg mb-4">TOTAL</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Sous-total</span>
                                <span>{subtotal.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frais de livraison</span>
                                <span>{shipping.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Total</span>
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
                                    alert("Impossible de trouver la commande associée à ce panier.");
                                }
                            }}
                        >
                            Passer au paiement
                        </Button>
                        <div className="mt-4 space-y-2">
                            <Button variant="outline" className="w-full text-sm">
                                Payer en 4x
                            </Button>
                            <Button variant="outline" className="w-full text-sm">
                                Frais de port offerts dès 50 €
                            </Button>
                            <Button variant="outline" className="w-full text-sm">
                                Paiement sécurisé
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
