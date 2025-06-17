export interface CarouselLangage {
  '@id': string;
  '@type': string;
  id: number;
  code: string;
  title: string;
  description: string;
}

export interface Carousel {
  '@id': string;
  '@type': string;
  id: number;
  image_link: string;
  panel_order: number;
  carouselLangages: CarouselLangage[];
}

export interface CarouselApiResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: Carousel[];
}

export interface Slide {
  id: number
  title: string
  description: string
  image: string
  active: boolean
  order: number
}

export interface CreateCarouselInput {
  title: string;
  description: string;
  code: string; // "fr" ou "en"
  panel_order: number;
  imageFile?: File | null;
}
