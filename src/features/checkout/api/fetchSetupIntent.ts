// src/features/checkout/api/fetchSetupIntent.ts

import { getAllTokens } from "@/lib/utils";
import type { SetupIntentResponse } from "@/types/SetupIntent";

export async function fetchSetupIntent(orderId: number): Promise<SetupIntentResponse> {
  const { token } = getAllTokens();

  const res = await fetch(import.meta.env.VITE_API_URL + "payment/setup-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ order_id: orderId }),
  });

  if (!res.ok) {
    throw new Error("Erreur Stripe : " + res.statusText);
  }
  return res.json();
}
