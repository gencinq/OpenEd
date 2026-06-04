import { api } from '../lib/api';
import { Question, CreateQuestionDTO, Answer, CreateAnswerDTO } from '@shared/types';

export const questionsService = {
  async getQuestions(params: { subject?: string; search?: string; page?: number; limit?: number } = {}): Promise<{ questions: Question[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.subject) query.set('subject', params.subject);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await api.get<Question[]>(`/api/questions?${query.toString()}`);
    return {
      questions: res.data!,
      total: res.meta?.total || 0,
      totalPages: res.meta?.totalPages || 1
    };
  },

  async getQuestion(id: string): Promise<{ question: Question; answers: Answer[] }> {
    const res = await api.get<{ question: Question; answers: Answer[] }>(`/api/questions/${id}`);
    return res.data!;
  },

  async createQuestion(dto: CreateQuestionDTO): Promise<Question> {
    const res = await api.post<Question>('/api/questions', dto);
    return res.data!;
  },

  async deleteQuestion(id: string): Promise<void> {
    await api.del(`/api/questions/${id}`);
  },

  // Answers Operations
  async postAnswer(questionId: string, dto: CreateAnswerDTO): Promise<Answer> {
    const res = await api.post<Answer>(`/api/questions/${questionId}/answers`, dto);
    return res.data!;
  },

  async upvoteAnswer(answerId: string): Promise<number> {
    const res = await api.post<{ upvotes: number }>(`/api/answers/${answerId}/upvote`);
    return res.data!.upvotes;
  },

  async acceptAnswer(answerId: string): Promise<void> {
    await api.post(`/api/answers/${answerId}/accept`);
  }
};
