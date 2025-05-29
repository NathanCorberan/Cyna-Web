// src/components/StripePaymentForm.tsx

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { getAllTokens } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type Props = {
  orderId: number;
  setupIntentId: string | null;
};

export default function StripePaymentForm({ orderId, setupIntentId }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!stripe || !elements) {
      setMessage("Stripe non chargé");
      setLoading(false);
      return;
    }

    // 1. Confirme le setup (sauvegarde carte)
    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required", // gère le SCA, redirige seulement si besoin
    });

    if (error) {
      setMessage(error.message || "Erreur Stripe");
      setLoading(false);
      return;
    }

    // 2. Appelle ton backend pour checkout (paiement réel ou abonnement)
    if (!setupIntent?.payment_method) {
      setMessage("Erreur Stripe : Payment method introuvable");
      setLoading(false);
      return;
    }

    const { token } = getAllTokens();
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          order_id: orderId,
          payment_method_id: setupIntent.payment_method,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessage(data.error || "Erreur lors du paiement");
        setLoading(false);
        return;
      }

      // Redirige vers page de succès (ou affiche une confetti, ou autre)
      navigate("/success?order=" + orderId);
    } catch (e: any) {
      setMessage(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 py-10">
      <PaymentElement />
      {message && <div className="bg-red-50 rounded p-2 text-red-700">{message}</div>}
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#302082] hover:bg-[#3a2a9d] text-white"
      >
        {loading ? "Paiement..." : "Payer"}
      </Button>
    </form>
  );
}
