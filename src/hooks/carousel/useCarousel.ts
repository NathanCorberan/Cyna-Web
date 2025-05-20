import { useEffect, useState } from 'react';
import { fetchCarousels } from '@/features/carousel/api/fetchCarousel';
import type { Carousel } from '@/types/Carousel';

export function useCarousels() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCarousels()
      .then((data) => {
        if (isMounted) setCarousels(data);
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

  return { carousels, loading, error };
}
