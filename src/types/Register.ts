export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  isActivate?: boolean; 
}

export interface RegisterResponse {
  message: string;
}
