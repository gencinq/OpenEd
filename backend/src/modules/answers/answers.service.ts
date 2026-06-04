import { db } from '../../config/database';
import { Answer, CreateAnswerDTO } from '@shared/types';

export class AnswersService {
  static async getAnswersForQuestion(questionId: string, acceptedAnswerId?: string): Promise<Answer[]> {
    const result = await db.query(
      `SELECT a.id, a.question_id, a.user_id, a.body, a.upvotes, a.created_at, a.updated_at,
              u.display_name, u.avatar_url, u.role
       FROM answers a
       JOIN users u ON a.user_id = u.id
       WHERE a.question_id = $1
       ORDER BY a.upvotes DESC, a.created_at ASC`,
      [questionId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      questionId: row.question_id,
      userId: row.user_id,
      body: row.body,
      upvotes: row.upvotes,
      isAccepted: row.id === acceptedAnswerId,
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
  }

  static async createAnswer(userId: string, questionId: string, dto: CreateAnswerDTO): Promise<Answer> {
    // Check if question exists
    const qCheck = await db.query('SELECT id FROM questions WHERE id = $1', [questionId]);
    if (!qCheck.rowCount || qCheck.rowCount === 0) {
      throw new Error('Question not found');
    }

    const result = await db.query(
      `INSERT INTO answers (question_id, user_id, body)
       VALUES ($1, $2, $3)
       RETURNING id, question_id, user_id, body, upvotes, created_at, updated_at`,
      [questionId, userId, dto.body]
    );

    const row = result.rows[0];
    const authorRes = await db.query('SELECT display_name, avatar_url, role FROM users WHERE id = $1', [userId]);
    const author = authorRes.rows[0];

    return {
      id: row.id,
      questionId: row.question_id,
      userId: row.user_id,
      body: row.body,
      upvotes: row.upvotes,
      isAccepted: false,
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

  static async upvoteAnswer(id: string): Promise<number> {
    const result = await db.query(
      `UPDATE answers
       SET upvotes = upvotes + 1
       WHERE id = $1
       RETURNING upvotes`,
      [id]
    );

    if (!result.rowCount || result.rowCount === 0) {
      throw new Error('Answer not found');
    }

    return result.rows[0].upvotes;
  }

  static async acceptAnswer(id: string, userId: string): Promise<boolean> {
    // Find answer and question
    const res = await db.query(
      `SELECT a.question_id, q.user_id 
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.id = $1`,
      [id]
    );

    if (!res.rowCount || res.rowCount === 0) {
      throw new Error('Answer not found');
    }

    const { question_id, user_id } = res.rows[0];

    if (user_id !== userId) {
      throw new Error('Only the question author can accept an answer');
    }

    // Set accepted answer
    await db.query(
      `UPDATE questions
       SET accepted_answer_id = $1
       WHERE id = $2`,
      [id, question_id]
    );

    return true;
  }
}
export default AnswersService;
