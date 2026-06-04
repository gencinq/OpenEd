export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'Geography',
  'English',
  'Economics',
  'Philosophy',
  'Psychology',
  'Engineering',
  'Medicine',
  'Law',
  'Business',
  'Art',
  'Music',
  'Other',
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const CONTENT_TYPES = {
  NOTE: 'note',
  GUIDE: 'guide',
  QUESTION: 'question',
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = ['application/pdf'] as const;

export const API_PREFIX = '/api' as const;
