import { PaginationMeta } from '@shared/types';
import { PAGINATION } from '@shared/constants';

export function getPagination(query: any) {
  const page = Math.max(1, parseInt(query.page || String(PAGINATION.DEFAULT_PAGE), 10));
  let limit = Math.max(1, parseInt(query.limit || String(PAGINATION.DEFAULT_LIMIT), 10));
  
  if (limit > PAGINATION.MAX_LIMIT) {
    limit = PAGINATION.MAX_LIMIT;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
  };
}
