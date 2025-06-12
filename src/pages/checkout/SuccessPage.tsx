// src/pages/SuccessPage.tsx

import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SuccessPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const order = params.get("order");

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-2xl font-bold text-green-600 mb-2">
        {t("success.paymentSuccess", "Paiement réussi 🎉")}
      </h1>
      <p className="mb-4">
        {t("success.orderPaid", "Commande n°{{order}} payée et validée.", { order })}
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-[#302082] hover:bg-[#3a2a9d] text-white rounded-lg"
      >
        {t("success.returnHome", "Retour à l'accueil")}
      </Link>
    </div>
  );
}
