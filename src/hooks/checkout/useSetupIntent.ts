// src/hooks/checkout/useSetupIntent.ts

import { useEffect, useState } from "react";
import { fetchSetupIntent } from "@/features/checkout/api/fetchSetupIntent";
import type { SetupIntentResponse } from "@/types/SetupIntent";

export function useSetupIntent(orderId?: number) {
  const [data, setData] = useState<SetupIntentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    fetchSetupIntent(orderId)
      .then((res) => {
        if (res.error) setError(res.error);
        setData(res);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  return { data, loading, error };
}
