// src/pages/SuccessPage.tsx

import { useSearchParams, Link } from "react-router-dom";

export default function SuccessPage() {
  const [params] = useSearchParams();
  const order = params.get("order");

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-2xl font-bold text-green-600 mb-2">Paiement réussi 🎉</h1>
      <p className="mb-4">Commande n°{order} payée et validée.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-[#302082] hover:bg-[#3a2a9d] text-white rounded-lg"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
