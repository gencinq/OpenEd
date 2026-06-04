export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  q: string;
  type?: 'notes' | 'guides' | 'questions' | 'users';
  subject?: string;
}

export interface SearchResults {
  notes: Array<{ id: string; title: string; subject?: string; createdAt: string }>;
  guides: Array<{ id: string; title: string; subject?: string; createdAt: string }>;
  questions: Array<{ id: string; title: string; subject?: string; createdAt: string }>;
  users: Array<{ id: string; displayName: string; avatarUrl?: string }>;
}
