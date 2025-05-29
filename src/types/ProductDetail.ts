// src/types/ProductDetail.ts

import type { ProductLangage } from "./ProductLangage";
import type { ProductImage } from "./ProductImage";
import type { SubscriptionType } from "./SubscriptionType";

export type ProductDetailApiResponse = {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: [
    number,             // id
    number,             // available_stock
    string,             // updatedAt
    string,             // status
    string,             // code
    ProductLangage[],   // productLangages
    ProductImage[],     // productImages
    SubscriptionType[], // subscriptionTypes
  ];
};

export type ProductDetail = {
  id: number;
  available_stock: number;
  updatedAt: string;
  status: string;
  code: string;
  productLangages: ProductLangage[];
  productImages: ProductImage[];
  subscriptionTypes: SubscriptionType[];
};
