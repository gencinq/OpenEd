export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  role: 'user' | 'admin';
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
