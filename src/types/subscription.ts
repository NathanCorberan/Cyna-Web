// types/subscription.ts
export interface MySubOutputDto {
  id: number
  startDate: string
  endDate: string | null
  status: "available" | "paused" | "expiring" | "cancelled" | string
  type: string
  price: number
  productTitle: string
  productImage?: string
  productDescription?: string
}

export interface MySubApiResponse {
  "@context": string
  "@id": string
  "@type": string
  member: MySubOutputDto[]
}
