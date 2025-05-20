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
