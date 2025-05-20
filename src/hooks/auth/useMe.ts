// src/hooks/account/useMe.ts
import { useEffect, useState } from "react";
import { fetchMe } from "@/features/account/api/fetchMe";
import type { User } from "@/types/User";

export function useMe() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchMe()
      .then((data) => {
        if (isMounted) setMe(data);
      })
      .catch((e) => {
        if (isMounted) setError(e.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { me, loading, error };
}
