import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductById } from "@/hooks/products/useProductById";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import placeholder from "@/assets/placeholder.png";
import { Heart, ShoppingCart, ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { useAddToCart } from "@/hooks/carts/useAddToCart";
import { getAllTokens } from "@/lib/utils"; // <-- importe ici

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductById(id!);

  // États pour le pricing, l’image sélectionnée et la quantité
  const [selectedPricing, setSelectedPricing] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartQty, setCartQty] = useState<number>(1);

  // HOOK pour ajout panier
  const { addToCart, loading: addLoading, error: addError, orderItem } = useAddToCart();
  const PRODUITS_IMAGE_BASE = "http://srv839278.hstgr.cloud:8000/assets/images/products/";

  const handleAddToCart = async () => {
    if (!product) return;

    const { token, cartToken } = getAllTokens();

    const subscriptionTypeId = product.subscriptionTypes[selectedPricing]?.id;
    if (!subscriptionTypeId) return;

    await addToCart(
      product.id,
      cartQty,
      subscriptionTypeId,
      {
        cartToken: cartToken || undefined,
        jwt: token || undefined,
      }
    );
  };

  if (loading) {
    return <div className="flex justify-center py-12 text-gray-400 text-lg">Chargement...</div>;
  }
  if (error || !product) {
    return <div className="flex justify-center py-12 text-red-500 text-lg">{error || "Produit introuvable"}</div>;
  }

  const productLang = product.productLangages.find(l => l.code === "FR") || product.productLangages[0];
  const images = product.productImages.length ? product.productImages : [{ image_link: placeholder, id: 0, name: "" }];
  const pricing = product.subscriptionTypes;
  const quantity = product.available_stock;
  const status = product.status;

  const formattedDescription = productLang?.description?.replace(/\r\n/g, "\n").split("\n") ?? [];

  return (
    <div className="min-h-screen">
      {/* Header avec logo circulaire */}
      <header className="bg-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-center">
            <Link to="/" className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-[#302082] flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white font-bold text-xl">CYNA</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-8">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link to="/produits" className="inline-flex items-center gap-2 text-[#302082] hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Retour aux produits
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Section Images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={images[selectedImageIndex]?.image_link.startsWith("http")
                  ? images[selectedImageIndex]?.image_link
                  : PRODUITS_IMAGE_BASE + `${images[selectedImageIndex]?.image_link}`}
                alt={productLang?.name}
                className="object-cover w-full h-full"
              />
              {/* Badge statut */}
              <div className="absolute top-4 left-4">
                <Badge className={`${status === "Disponible" ? "bg-green-500" : "bg-red-500"} text-white`}>
                  {status}
                </Badge>
              </div>
              {/* Favori */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full shadow-sm"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-[#302082] ring-2 ring-[#302082]/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={
                        image.image_link
                          ? (image.image_link.startsWith("http")
                              ? image.image_link
                              : PRODUITS_IMAGE_BASE + image.image_link)
                          : placeholder
                      }
                      alt={`${productLang?.name} - Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{productLang?.name}</h1>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                {formattedDescription.map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph.replace(/\*/g, "")}</p>
                ))}
              </div>
            </div>

            {/* Options de prix */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Choisissez votre formule</h3>
              <div className="grid gap-3">
                {pricing.map((option, idx) => {
                  // Centralise le mapping pour labels et descriptions
                  const type = option.type?.toLowerCase();
                  let label = "";
                  let description = "";
                  let suffix = "";

                  if (type === "monthly") {
                    label = "Abonnement mensuel";
                    description = "Facturation mensuelle, résiliable à tout moment";
                    suffix = "/mois";
                  } else if (type === "yearly") {
                    label = "Abonnement annuel";
                    description = "Facturation annuelle, résiliable à tout moment";
                    suffix = "/an";
                  } else if (type === "lifetime") {
                    label = "Licence à vie";
                    description = "Paiement unique, accès permanent";
                    suffix = "";
                  } else {
                    label = option.type;
                    description = "";
                    suffix = "";
                  }

                  return (
                    <Card
                      key={option.id}
                      className={`cursor-pointer transition-all ${
                        selectedPricing === idx
                          ? "ring-2 ring-[#302082] border-[#302082]"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPricing(idx)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedPricing === idx ? "border-[#302082] bg-[#302082]" : "border-gray-300"
                              }`}
                            >
                              {selectedPricing === idx && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium capitalize">{label}</div>
                              <div className="text-sm text-gray-600">{description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#302082]">
                              {option.price} {suffix}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Sélecteur de quantité moderne */}
            <div className="flex items-center gap-3 my-2">
              <span className="text-gray-700 font-medium">Quantité :</span>
              <div className="flex items-center border rounded-lg px-3 py-1 bg-white" style={{ minWidth: 110 }}>
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition"
                  onClick={() => setCartQty(q => Math.max(1, q - 1))}
                  disabled={cartQty <= 1}
                  aria-label="Diminuer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="mx-4 w-6 text-center select-none font-medium">{cartQty}</span>
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition"
                  onClick={() => setCartQty(q => Math.min(quantity, q + 1))}
                  disabled={cartQty >= quantity}
                  aria-label="Augmenter"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400 ml-2">(max {quantity})</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">{quantity} unités en stock</span>
            </div>

            {/* Feedback Ajout */}
            {addError && <div className="text-red-600 bg-red-50 rounded px-3 py-2">{addError}</div>}
            {orderItem && <div className="text-green-700 bg-green-50 rounded px-3 py-2">Produit ajouté au panier !</div>}

            {/* Bouton d'achat */}
            <div className="space-y-3">
              <Button
                className="w-full bg-[#302082] hover:bg-[#3a2a9d] text-white py-3 text-lg font-semibold"
                size="lg"
                onClick={handleAddToCart}
                disabled={addLoading}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addLoading ? "Ajout en cours..." : (
                  <>
                    Ajouter au panier - {pricing[selectedPricing]?.price}
                    {cartQty > 1 && <span className="ml-2 font-normal">x{cartQty}</span>}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
