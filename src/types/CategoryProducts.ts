import type { ProductLangage } from "./ProductLangage";
import type { ProductImage } from "./ProductImage";
import type { SubscriptionType } from "./SubscriptionType";

export interface CategoryProduct {
  "@id": string;
  "@type": string;
  id: number;
  available_stock: number;
  creation_date: string;
  status: string;
  category: string; // "/api/categories/1"
  productLangages: ProductLangage[];
  productImages: ProductImage[];
  subscriptionTypes: SubscriptionType[];
}

export interface CategoryProductsApiResponse {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: CategoryProduct[];
}
