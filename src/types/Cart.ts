export interface CartOrderItem {
  id: number;
  product: string;
  quantity: number;
  unitPrice: string;
  total_price: string;
}

export interface CartAPIResponse {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: CartOrderItem[];
}
