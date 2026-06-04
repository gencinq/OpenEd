import { db } from '../../config/database';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@shared/types';

export class NotesService {
  static async getNotes(
    currentUserId: string | undefined,
    subject: string | undefined,
    search: string | undefined,
    limit: number,
    offset: number
  ): Promise<{ notes: Note[]; total: number }> {
    let whereClause = '(n.is_public = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (currentUserId) {
      whereClause += ` OR n.user_id = $${paramIndex}`;
      params.push(currentUserId);
      paramIndex++;
    }
    whereClause += ')';

    if (subject) {
      whereClause += ` AND n.subject = $${paramIndex}`;
      params.push(subject);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (n.title ILIKE $${paramIndex} OR n.content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) 
      FROM notes n 
      WHERE ${whereClause}`;
      
    const totalRes = await db.query(countQuery, params);
    const total = parseInt(totalRes.rows[0].count, 10);

    // Add pagination params
    const queryParams = [...params, limit, offset];
    const selectQuery = `
      SELECT n.id, n.user_id, n.title, n.content, n.subject, n.is_public, n.created_at, n.updated_at,
             u.display_name, u.avatar_url, u.role
      FROM notes n
      JOIN users u ON n.user_id = u.id
      WHERE ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    const notesRes = await db.query(selectQuery, queryParams);

    const notes = notesRes.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      subject: row.subject || undefined,
      isPublic: row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      author: {
        id: row.user_id,
        email: '', // Don't expose email publicly
        displayName: row.display_name,
        avatarUrl: row.avatar_url || undefined,
        role: row.role,
        createdAt: '',
        updatedAt: '',
      },
    }));

    return { notes, total };
  }

  static async getNoteById(id: string, currentUserId: string | undefined): Promise<Note | null> {
    const result = await db.query(
      `SELECT n.id, n.user_id, n.title, n.content, n.subject, n.is_public, n.created_at, n.updated_at,
              u.display_name, u.avatar_url, u.role
       FROM notes n
       JOIN users u ON n.user_id = u.id
       WHERE n.id = $1`,
      [id]
    );

    const row = result.rows[0];
    if (!row) return null;

    // Check if private and not owner
    if (!row.is_public && row.user_id !== currentUserId) {
      throw new Error('Access denied. Private note.');
    }

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      subject: row.subject || undefined,
      isPublic: row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      author: {
        id: row.user_id,
        email: '',
        displayName: row.display_name,
        avatarUrl: row.avatar_url || undefined,
        role: row.role,
        createdAt: '',
        updatedAt: '',
      },
    };
  }

  static async createNote(userId: string, dto: CreateNoteDTO): Promise<Note> {
    const result = await db.query(
      `INSERT INTO notes (user_id, title, content, subject, is_public)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, content, subject, is_public, created_at, updated_at`,
      [userId, dto.title, dto.content, dto.subject || null, dto.isPublic ?? false]
    );

    const row = result.rows[0];

    // Fetch author info to return complete Note
    const authorRes = await db.query('SELECT display_name, avatar_url, role FROM users WHERE id = $1', [userId]);
    const author = authorRes.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      subject: row.subject || undefined,
      isPublic: row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      author: {
        id: userId,
        email: '',
        displayName: author.display_name,
        avatarUrl: author.avatar_url || undefined,
        role: author.role,
        createdAt: '',
        updatedAt: '',
      },
    };
  }

  static async updateNote(id: string, userId: string, dto: UpdateNoteDTO): Promise<Note> {
    // Check ownership
    const check = await db.query('SELECT user_id FROM notes WHERE id = $1', [id]);
    if (!check.rowCount || check.rowCount === 0) {
      throw new Error('Note not found');
    }
    if (check.rows[0].user_id !== userId) {
      throw new Error('You do not have permission to update this note');
    }

    const result = await db.query(
      `UPDATE notes
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           subject = COALESCE($3, subject),
           is_public = COALESCE($4, is_public),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, user_id, title, content, subject, is_public, created_at, updated_at`,
      [dto.title, dto.content, dto.subject || null, dto.isPublic, id]
    );

    const row = result.rows[0];
    const authorRes = await db.query('SELECT display_name, avatar_url, role FROM users WHERE id = $1', [userId]);
    const author = authorRes.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      subject: row.subject || undefined,
      isPublic: row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      author: {
        id: userId,
        email: '',
        displayName: author.display_name,
        avatarUrl: author.avatar_url || undefined,
        role: author.role,
        createdAt: '',
        updatedAt: '',
      },
    };
  }

  static async deleteNote(id: string, userId: string): Promise<boolean> {
    // Check ownership
    const check = await db.query('SELECT user_id FROM notes WHERE id = $1', [id]);
    if (!check.rowCount || check.rowCount === 0) {
      throw new Error('Note not found');
    }
    if (check.rows[0].user_id !== userId) {
      throw new Error('You do not have permission to delete this note');
    }

    const result = await db.query('DELETE FROM notes WHERE id = $1', [id]);
    return (result.rowCount && result.rowCount > 0) || false;
  }
}
export default NotesService;
