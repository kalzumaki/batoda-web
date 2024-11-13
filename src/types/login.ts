export interface LoginResponse {
    access_token: string;
    user: {
      user_type_id: number;
    };
    status?: boolean;
    message?: string;
    remaining_attempts?: number;
    retry_after?: number;
  }
