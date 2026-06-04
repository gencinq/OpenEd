import { ApiResponse } from '@shared/types';

const BASE_URL = ''; // Proxied through Vite to http://localhost:3001

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('opened_token');
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set Content-Type only if not sending FormData
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let payload: ApiResponse<T>;
  try {
    payload = await response.json();
  } catch (err) {
    throw new ApiError('Failed to parse response from server', response.status);
  }

  if (!response.ok || !payload.success) {
    throw new ApiError(payload.error || 'Request failed', response.status);
  }

  return payload;
}

export const api = {
  get<T>(path: string, options?: RequestInit) {
    return request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: any, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    return request<T>(path, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  put<T>(path: string, body?: any, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  del<T>(path: string, options?: RequestInit) {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};
