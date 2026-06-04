import { db } from '../../config/database';
import { StudyGuide, CreateGuideDTO, UpdateGuideDTO } from '@shared/types';

export class StudyGuidesService {
  static async getGuides(
    currentUserId: string | undefined,
    subject: string | undefined,
    search: string | undefined,
    limit: number,
    offset: number
  ): Promise<{ guides: StudyGuide[]; total: number }> {
    let whereClause = '(s.is_public = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (currentUserId) {
      whereClause += ` OR s.user_id = $${paramIndex}`;
      params.push(currentUserId);
      paramIndex++;
    }
    whereClause += ')';

    if (subject) {
      whereClause += ` AND s.subject = $${paramIndex}`;
      params.push(subject);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (s.title ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) 
      FROM study_guides s 
      WHERE ${whereClause}`;

    const totalRes = await db.query(countQuery, params);
    const total = parseInt(totalRes.rows[0].count, 10);

    const queryParams = [...params, limit, offset];
    const selectQuery = `
      SELECT s.id, s.user_id, s.title, s.description, s.subject, s.sections, s.is_public, s.created_at, s.updated_at,
             u.display_name, u.avatar_url, u.role
      FROM study_guides s
      JOIN users u ON s.user_id = u.id
      WHERE ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    const guidesRes = await db.query(selectQuery, queryParams);

    const guides = guidesRes.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description || undefined,
      subject: row.subject || undefined,
      sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections,
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
    }));

    return { guides, total };
  }

  static async getGuideById(id: string, currentUserId: string | undefined): Promise<StudyGuide | null> {
    const result = await db.query(
      `SELECT s.id, s.user_id, s.title, s.description, s.subject, s.sections, s.is_public, s.created_at, s.updated_at,
              u.display_name, u.avatar_url, u.role
       FROM study_guides s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );

    const row = result.rows[0];
    if (!row) return null;

    if (!row.is_public && row.user_id !== currentUserId) {
      throw new Error('Access denied. Private study guide.');
    }

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description || undefined,
      subject: row.subject || undefined,
      sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections,
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

  static async createGuide(userId: string, dto: CreateGuideDTO): Promise<StudyGuide> {
    const sectionsJson = JSON.stringify(dto.sections || []);
    const result = await db.query(
      `INSERT INTO study_guides (user_id, title, description, subject, sections, is_public)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, title, description, subject, sections, is_public, created_at, updated_at`,
      [userId, dto.title, dto.description || null, dto.subject || null, sectionsJson, dto.isPublic ?? true]
    );

    const row = result.rows[0];
    const authorRes = await db.query('SELECT display_name, avatar_url, role FROM users WHERE id = $1', [userId]);
    const author = authorRes.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description || undefined,
      subject: row.subject || undefined,
      sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections,
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

  static async updateGuide(id: string, userId: string, dto: UpdateGuideDTO): Promise<StudyGuide> {
    const check = await db.query('SELECT user_id FROM study_guides WHERE id = $1', [id]);
    if (!check.rowCount || check.rowCount === 0) {
      throw new Error('Study guide not found');
    }
    if (check.rows[0].user_id !== userId) {
      throw new Error('You do not have permission to update this guide');
    }

    const sectionsJson = dto.sections ? JSON.stringify(dto.sections) : undefined;

    const result = await db.query(
      `UPDATE study_guides
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           subject = COALESCE($3, subject),
           sections = COALESCE($4, sections::jsonb),
           is_public = COALESCE($5, is_public),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, user_id, title, description, subject, sections, is_public, created_at, updated_at`,
      [dto.title, dto.description || null, dto.subject || null, sectionsJson, dto.isPublic, id]
    );

    const row = result.rows[0];
    const authorRes = await db.query('SELECT display_name, avatar_url, role FROM users WHERE id = $1', [userId]);
    const author = authorRes.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description || undefined,
      subject: row.subject || undefined,
      sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections,
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

  static async deleteGuide(id: string, userId: string): Promise<boolean> {
    const check = await db.query('SELECT user_id FROM study_guides WHERE id = $1', [id]);
    if (!check.rowCount || check.rowCount === 0) {
      throw new Error('Study guide not found');
    }
    if (check.rows[0].user_id !== userId) {
      throw new Error('You do not have permission to delete this guide');
    }

    const result = await db.query('DELETE FROM study_guides WHERE id = $1', [id]);
    return (result.rowCount && result.rowCount > 0) || false;
  }
}
export default StudyGuidesService;
