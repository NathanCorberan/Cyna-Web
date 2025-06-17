import type { CarouselApiResponse, Carousel } from '@/types/Carousel';

const API_URL = import.meta.env.VITE_API_URL + 'carousels';

export async function fetchCarousels(): Promise<Carousel[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch carousels: ${res.status}`);
  }
  const data: CarouselApiResponse = await res.json();
  return data.member;
}
