export interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  email_verified_at: string | null;
  mobile_number: string;
  address: string;
  birthday: string;
  age: number;
  gender: string;
  user_type_id: number;
  is_approved: number;
  created_at: string;
  updated_at: string;
  qr_code: string | null;
  profile: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User,
  status?: boolean;
  message?: string;
  remaining_attempts?: number;
  retry_after?: number;
}
