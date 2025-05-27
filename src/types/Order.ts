export interface UserOrderProductDto {
  id: number;
  name: string;
  quantity: number;
  totalPrice: string;
}

export interface UserOrderOutputDto {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: string;
  products: UserOrderProductDto[];
  trackingNumber?: string;
}

export interface OrderApiResponse {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: UserOrderOutputDto[];
}
