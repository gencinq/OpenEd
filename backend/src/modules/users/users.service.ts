import { db } from '../../config/database';
import { User, UpdateUserDTO } from '@shared/types';

export class UsersService {
  static async getUserProfile(id: string): Promise<User | null> {
    const result = await db.query(
      `SELECT id, email, display_name, avatar_url, bio, role, created_at, updated_at 
       FROM users WHERE id = $1`,
      [id]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      avatarUrl: row.avatar_url || undefined,
      bio: row.bio || undefined,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async updateUserProfile(id: string, dto: UpdateUserDTO): Promise<User> {
    const result = await db.query(
      `UPDATE users 
       SET display_name = COALESCE($1, display_name), 
           avatar_url = COALESCE($2, avatar_url), 
           bio = COALESCE($3, bio),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, display_name, avatar_url, bio, role, created_at, updated_at`,
      [dto.displayName, dto.avatarUrl, dto.bio, id]
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error('User not found');
    }

    return {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      avatarUrl: row.avatar_url || undefined,
      bio: row.bio || undefined,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Admin Methods
  static async getAllUsers(limit: number, offset: number): Promise<{ users: User[]; total: number }> {
    const totalRes = await db.query('SELECT COUNT(*) FROM users');
    const total = parseInt(totalRes.rows[0].count, 10);

    const usersRes = await db.query(
      `SELECT id, email, display_name, avatar_url, bio, role, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const users = usersRes.rows.map((row) => ({
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      avatarUrl: row.avatar_url || undefined,
      bio: row.bio || undefined,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { users, total };
  }

  static async deleteContent(type: string, id: string): Promise<boolean> {
    let tableName = '';
    if (type === 'note') tableName = 'notes';
    else if (type === 'guide') tableName = 'study_guides';
    else if (type === 'question') tableName = 'questions';
    else {
      throw new Error('Invalid content type for moderation');
    }

    const result = await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
    return (result.rowCount && result.rowCount > 0) || false;
  }
}
export default UsersService;
