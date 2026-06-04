import { api } from '../lib/api';
import { SearchResults } from '@shared/types';

export const searchService = {
  async search(q: string, subject?: string): Promise<SearchResults> {
    const query = new URLSearchParams();
    query.set('q', q);
    if (subject) query.set('subject', subject);

    const res = await api.get<SearchResults>(`/api/search?${query.toString()}`);
    return res.data!;
  }
};
