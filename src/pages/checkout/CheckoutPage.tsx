// src/pages/checkout/Checkout.tsx

import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSetupIntent } from "@/hooks/checkout/useSetupIntent";
import StripePaymentForm from "@/features/checkout/components/StripePaymentForm";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const id = orderId ? Number(orderId) : undefined;

  const { data, loading, error } = useSetupIntent(id);

  if (error) return <div className="text-red-600 py-10 text-center">{error}</div>;
  if (loading || !data?.client_secret)
    return <div className="text-center py-16">{t("checkout.loadingPayment")}</div>;

  return (
    <Elements options={{ clientSecret: data.client_secret }} stripe={stripePromise}>
      <StripePaymentForm orderId={id!} setupIntentId={data.setup_intent_id} />
    </Elements>
  );
}
