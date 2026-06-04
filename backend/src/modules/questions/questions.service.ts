import { db } from '../../config/database';
import { Question, CreateQuestionDTO, UpdateQuestionDTO } from '@shared/types';

export class QuestionsService {
  static async getQuestions(
    subject: string | undefined,
    search: string | undefined,
    limit: number,
    offset: number
  ): Promise<{ questions: Question[]; total: number }> {
    let whereClause = '1 = 1';
    const params: any[] = [];
    let paramIndex = 1;

    if (subject) {
      whereClause += ` AND q.subject = $${paramIndex}`;
      params.push(subject);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (q.title ILIKE $${paramIndex} OR q.body ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) 
      FROM questions q 
      WHERE ${whereClause}`;

    const totalRes = await db.query(countQuery, params);
    const total = parseInt(totalRes.rows[0].count, 10);

    const queryParams = [...params, limit, offset];
    const selectQuery = `
      SELECT q.id, q.user_id, q.title, q.body, q.subject, q.accepted_answer_id, q.created_at, q.updated_at,
             u.display_name, u.avatar_url, u.role,
             (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
      FROM questions q
      JOIN users u ON q.user_id = u.id
      WHERE ${whereClause}
      ORDER BY q.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    const questionsRes = await db.query(selectQuery, queryParams);

    const questions = questionsRes.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      body: row.body,
      subject: row.subject || undefined,
      acceptedAnswerId: row.accepted_answer_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      answerCount: parseInt(row.answer_count || '0', 10),
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

    return { questions, total };
  }

  static async getQuestionById(id: string): Promise<Question | null> {
    const result = await db.query(
      `SELECT q.id, q.user_id, q.title, q.body, q.subject, q.accepted_answer_id, q.created_at, q.updated_at,
              u.display_name, u.avatar_url, u.role
       FROM questions q
       JOIN users u ON q.user_id = u.id
       WHERE q.id = $1`,
      [id]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      body: row.body,
      subject: row.subject || undefined,
      acceptedAnswerId: row.accepted_answer_id || undefined,
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

  static async createQuestion(userId: string, dto: CreateQuestionDTO): Promise<Question> {
    const result = await db.query(
      `INSERT INTO questions (user_id, title, body, subject)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, title, body, subject, accepted_answer_id, created_at, updated_at`,
      [userId, dto.title, dto.body, dto.subject || null]
    );

    const row = result.rows[0];
    const authorRes = await db.query('SELECT display_name, avatar_url, role FROM users WHERE id = $1', [userId]);
    const author = authorRes.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      body: row.body,
      subject: row.subject || undefined,
      acceptedAnswerId: row.accepted_answer_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      answerCount: 0,
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

  static async deleteQuestion(id: string, userId: string): Promise<boolean> {
    const check = await db.query('SELECT user_id FROM questions WHERE id = $1', [id]);
    if (!check.rowCount || check.rowCount === 0) {
      throw new Error('Question not found');
    }
    if (check.rows[0].user_id !== userId) {
      throw new Error('You do not have permission to delete this question');
    }

    const result = await db.query('DELETE FROM questions WHERE id = $1', [id]);
    return (result.rowCount && result.rowCount > 0) || false;
  }
}
export default QuestionsService;
