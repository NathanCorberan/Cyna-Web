export interface CategoryLanguage {
  code: string;
  name: string;
  description: string;
}

export interface Category {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  creation_date: string;
  category_order: number;
  imageLink: string;
  categoryLanguages: CategoryLanguage[];
  nbProducts: number;
}

export interface CategoryApiResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: Category[];
}

export interface CategoryFormInput {
  name: string;
  description: string;
  lang: string;
  category_order: number;
  imageFile?: File | null;
}

export type CategoryFormErrors = {
  [K in keyof CategoryFormInput]?: string;
};
