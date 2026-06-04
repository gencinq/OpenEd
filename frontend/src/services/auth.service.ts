import { api } from '../lib/api';
import { User, CreateUserDTO, LoginDTO, AuthResponse, UpdateUserDTO } from '@shared/types';

export const authService = {
  async register(dto: CreateUserDTO): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/register', dto);
    return res.data!;
  },

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/login', dto);
    return res.data!;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>('/api/auth/me');
    return res.data!;
  },

  async getGoogleAuthUrl(): Promise<string> {
    const res = await api.get<{ url: string }>('/api/auth/google');
    return res.data!.url;
  },

  async getProfile(userId: string): Promise<User> {
    const res = await api.get<User>(`/api/users/${userId}`);
    return res.data!;
  },

  async updateProfile(userId: string, dto: UpdateUserDTO): Promise<User> {
    const res = await api.put<User>(`/api/users/${userId}`, dto);
    return res.data!;
  },

  // Admin moderation content deletion and user listing
  async listUsers(page = 1, limit = 12): Promise<{ users: User[]; total: number; totalPages: number }> {
    const res = await api.get<User[]>(`/api/admin/users?page=${page}&limit=${limit}`);
    return {
      users: res.data!,
      total: res.meta?.total || 0,
      totalPages: res.meta?.totalPages || 1
    };
  },

  async deleteContent(type: 'note' | 'guide' | 'question', id: string): Promise<void> {
    await api.del(`/api/admin/content/${type}/${id}`);
  }
};
