export interface Category {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  creation_date: string;
  category_order: number;
  imageLink: string;
  slogan?: string;      
  description?: string;
}

export interface CategoryApiResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: Category[];
}
