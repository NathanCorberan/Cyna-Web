import { useEffect, useState } from 'react';
import { fetchCategories } from '@/lib/fetchCategories';
import type { Category } from '@/types/Category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCategories()
      .then((data) => {
        if (isMounted) setCategories(data);
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

  return { categories, loading, error };
}
