export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginDTO {
  email: string;
  password?: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}