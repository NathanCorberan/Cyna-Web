// src/types/Product.ts
export interface ProductLangage {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface ProductImage {
  id: number;
  image_link: string;
  name: string;
}

export interface SubscriptionType {
  id: number;
  type: string;
  price: string;
}

export interface Product {
  id: number;
  available_stock: number;
  creation_date: string;
  status: string;
  category_name: string;
  productLangages: ProductLangage[];
  productImages: ProductImage[];
  subscriptionTypes: SubscriptionType[];
}

export interface ProductApiResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: Product[];
}
