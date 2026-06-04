import type { User } from './user';

export interface Question {
  id: string;
  userId: string;
  title: string;
  body: string;
  subject?: string;
  acceptedAnswerId?: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
  answerCount?: number;
}

export interface CreateQuestionDTO {
  title: string;
  body: string;
  subject?: string;
}

export interface UpdateQuestionDTO {
  title?: string;
  body?: string;
  subject?: string;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  body: string;
  upvotes: number;
  isAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface CreateAnswerDTO {
  body: string;
}
