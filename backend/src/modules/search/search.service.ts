import { db } from '../../config/database';
import { SearchResults } from '@shared/types';

export class SearchService {
  static async searchAll(q: string, subject?: string): Promise<SearchResults> {
    const searchQuery = `%${q}%`;
    const subFilter = subject ? 'AND subject = $2' : '';
    const notesParams = subject ? [searchQuery, subject] : [searchQuery];
    const guidesParams = subject ? [searchQuery, subject] : [searchQuery];
    const questionsParams = subject ? [searchQuery, subject] : [searchQuery];
    
    // Notes Search (limited to public notes only)
    const notesRes = await db.query(
      `SELECT id, title, subject, created_at 
       FROM notes 
       WHERE is_public = true AND (title ILIKE $1 OR content ILIKE $1) ${subFilter}
       ORDER BY created_at DESC LIMIT 5`,
      notesParams
    );

    // Guides Search
    const guidesRes = await db.query(
      `SELECT id, title, subject, created_at 
       FROM study_guides 
       WHERE is_public = true AND (title ILIKE $1 OR description ILIKE $1) ${subFilter}
       ORDER BY created_at DESC LIMIT 5`,
      guidesParams
    );

    // Questions Search
    const questionsRes = await db.query(
      `SELECT id, title, subject, created_at 
       FROM questions 
       WHERE (title ILIKE $1 OR body ILIKE $1) ${subFilter}
       ORDER BY created_at DESC LIMIT 5`,
      questionsParams
    );

    // Users Search (ignores subject filter since users don't have subjects)
    const usersRes = await db.query(
      `SELECT id, display_name, avatar_url 
       FROM users 
       WHERE display_name ILIKE $1
       ORDER BY display_name ASC LIMIT 5`,
      [searchQuery]
    );

    return {
      notes: notesRes.rows.map(row => ({
        id: row.id,
        title: row.title,
        subject: row.subject || undefined,
        createdAt: row.created_at
      })),
      guides: guidesRes.rows.map(row => ({
        id: row.id,
        title: row.title,
        subject: row.subject || undefined,
        createdAt: row.created_at
      })),
      questions: questionsRes.rows.map(row => ({
        id: row.id,
        title: row.title,
        subject: row.subject || undefined,
        createdAt: row.created_at
      })),
      users: usersRes.rows.map(row => ({
        id: row.id,
        displayName: row.display_name,
        avatarUrl: row.avatar_url || undefined
      }))
    };
  }
}
export default SearchService;
