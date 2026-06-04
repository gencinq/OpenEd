import { api } from '../lib/api';
import { PdfResource } from '@shared/types';

export const pdfService = {
  async uploadPdf(file: File, noteId?: string, guideId?: string): Promise<PdfResource> {
    const formData = new FormData();
    formData.append('file', file);
    if (noteId) formData.append('noteId', noteId);
    if (guideId) formData.append('guideId', guideId);

    const res = await api.post<PdfResource>('/api/pdf/upload', formData);
    return res.data!;
  },

  async getPdf(id: string): Promise<PdfResource> {
    const res = await api.get<PdfResource>(`/api/pdf/${id}`);
    return res.data!;
  },

  async listForResource(params: { noteId?: string; guideId?: string }): Promise<PdfResource[]> {
    const query = new URLSearchParams();
    if (params.noteId) query.set('noteId', params.noteId);
    if (params.guideId) query.set('guideId', params.guideId);
    
    const res = await api.get<PdfResource[]>(`/api/pdf?${query.toString()}`);
    return res.data || [];
  }
};
