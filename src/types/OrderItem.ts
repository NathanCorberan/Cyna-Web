export interface OrderItem {
  "@id": string;
  "@type": string;
  id: number;
  order: OrderRef;
  product: string; 
  quantity: number;
  unitPrice: string; 
  total_price: string;
}

export interface CartApiResponse {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: OrderItem[];
}

export interface OrderRef {
  "@id": string;
  "@type": string;
  cartToken?: string;
}