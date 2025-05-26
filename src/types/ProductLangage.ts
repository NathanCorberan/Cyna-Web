export interface ProductLangage {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  code: string; // ex: 'FR'
  name: string;
  description: string;
  product: string; // /api/products/1
}
