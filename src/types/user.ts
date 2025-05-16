export interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  mobile_number: number;
  user_type: {
    id: number;
    name: string;
  };
  is_approved: number;
  email_verified_at: string | null;
  deleted_at: string | null;
  user_valid_id?: {
    id_number: string;
    front_image: string;
    back_image: string;
  };
  has_brgy_clearance?: {
    image: string;
  };
  tricycle?: {
    driver_id: number;
    tricycle_number: string;
  };
}

export interface DriverDispatcher {
  id: number;
  full_name: string;
  birthday: string;
  email: string;
  mobile_number: string;
  address: string;
  user_type: "driver" | "dispatcher";
  is_active: number;
  last_login_at: string | null;
  tricycle_number: string | null;
  brgy_clearance: string;
  valid_id: {
    valid_id_type: string;
    id_number: string;
    front_image: string;
    back_image: string;
  };
  profile: string | null;
  deleted_at: string | null;
  created_at: string | null;
}

export interface Officers {
  id: number;
  fname: string;
  lname: string;
  email: string;
  mobile_number: number;
  address: string;
  birthday: string;
  user_type_id: number;
  profile: string | null;
  deleted_at: string;
  is_active: number;
  last_login_at: string;
  qr_code: string | null;
}

export interface UpdateUser {
  fname?: string | null;
  lname?: string | null;
  email?: string | null;
  mobile_number?: string | null;
  address?: string | null;
  gender?: string | null;
  birthday?: string | null;
}

export interface ChangePassword {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}
