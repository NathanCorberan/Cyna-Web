export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

export interface UserAdminResponse {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "customer" | "client" | "user";
  status: string;
  orders: number;
}

export interface UserAdmin {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: UserAdminResponse[];
}