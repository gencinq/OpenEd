import { api } from '../lib/api';
import { StudyGuide, CreateGuideDTO, UpdateGuideDTO } from '@shared/types';

export const guidesService = {
  async getGuides(params: { subject?: string; search?: string; page?: number; limit?: number } = {}): Promise<{ guides: StudyGuide[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.subject) query.set('subject', params.subject);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await api.get<StudyGuide[]>(`/api/guides?${query.toString()}`);
    return {
      guides: res.data!,
      total: res.meta?.total || 0,
      totalPages: res.meta?.totalPages || 1
    };
  },

  async getGuide(id: string): Promise<StudyGuide> {
    const res = await api.get<StudyGuide>(`/api/guides/${id}`);
    return res.data!;
  },

  async createGuide(dto: CreateGuideDTO): Promise<StudyGuide> {
    const res = await api.post<StudyGuide>('/api/guides', dto);
    return res.data!;
  },

  async updateGuide(id: string, dto: UpdateGuideDTO): Promise<StudyGuide> {
    const res = await api.put<StudyGuide>(`/api/guides/${id}`, dto);
    return res.data!;
  },

  async deleteGuide(id: string): Promise<void> {
    await api.del(`/api/guides/${id}`);
  }
};
