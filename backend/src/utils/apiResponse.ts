import { ApiResponse, PaginationMeta } from '@shared/types';

export function success<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
  };
}

export function error(message: string): ApiResponse<null> {
  return {
    success: false,
    error: message,
  };
}
