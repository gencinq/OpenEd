import { api } from '../lib/api';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@shared/types';

export const notesService = {
  async getNotes(params: { subject?: string; search?: string; page?: number; limit?: number } = {}): Promise<{ notes: Note[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.subject) query.set('subject', params.subject);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await api.get<Note[]>(`/api/notes?${query.toString()}`);
    return {
      notes: res.data!,
      total: res.meta?.total || 0,
      totalPages: res.meta?.totalPages || 1
    };
  },

  async getNote(id: string): Promise<Note> {
    const res = await api.get<Note>(`/api/notes/${id}`);
    return res.data!;
  },

  async createNote(dto: CreateNoteDTO): Promise<Note> {
    const res = await api.post<Note>('/api/notes', dto);
    return res.data!;
  },

  async updateNote(id: string, dto: UpdateNoteDTO): Promise<Note> {
    const res = await api.put<Note>(`/api/notes/${id}`, dto);
    return res.data!;
  },

  async deleteNote(id: string): Promise<void> {
    await api.del(`/api/notes/${id}`);
  }
};
