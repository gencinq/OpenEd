import type { User } from './user';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  subject?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  subject?: string;
  isPublic?: boolean;
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  subject?: string;
  isPublic?: boolean;
}

export interface GuideSection {
  title: string;
  content: string;
}

export interface StudyGuide {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subject?: string;
  sections: GuideSection[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface CreateGuideDTO {
  title: string;
  description?: string;
  subject?: string;
  sections: GuideSection[];
  isPublic?: boolean;
}

export interface UpdateGuideDTO {
  title?: string;
  description?: string;
  subject?: string;
  sections?: GuideSection[];
  isPublic?: boolean;
}

export interface PdfResource {
  id: string;
  userId: string;
  filename: string;
  storagePath: string;
  fileSize?: number;
  noteId?: string;
  guideId?: string;
  url?: string;
  createdAt: string;
}

export interface CreatePdfDTO {
  noteId?: string;
  guideId?: string;
}

export interface Comment {
  id: string;
  userId: string;
  noteId?: string;
  guideId?: string;
  body: string;
  createdAt: string;
  author?: User;
}
