import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../../config/database';
import { env } from '../../config/env';
import { CreateUserDTO, LoginDTO, User } from '@shared/types';

const googleClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
);

export class AuthService {
  static async register(dto: CreateUserDTO): Promise<{ user: User; token: string }> {
    // Check if email already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [dto.email]);
    if (existing.rowCount && existing.rowCount > 0) {
      throw new Error('Email is already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Save user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, display_name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, display_name, avatar_url, bio, role, created_at, updated_at`,
      [dto.email.toLowerCase(), passwordHash, dto.displayName]
    );

    const userRow = result.rows[0];
    const user: User = {
      id: userRow.id,
      email: userRow.email,
      displayName: userRow.display_name,
      avatarUrl: userRow.avatar_url || undefined,
      bio: userRow.bio || undefined,
      role: userRow.role,
      createdAt: userRow.created_at,
      updatedAt: userRow.updated_at,
    };

    const token = this.generateToken(user);
    return { user, token };
  }

  static async login(dto: LoginDTO): Promise<{ user: User; token: string }> {
    const result = await db.query(
      `SELECT id, email, password_hash, display_name, avatar_url, bio, role, google_id, created_at, updated_at 
       FROM users WHERE email = $1`,
      [dto.email.toLowerCase()]
    );

    const userRow = result.rows[0];
    if (!userRow) {
      throw new Error('Invalid email or password');
    }

    if (!userRow.password_hash) {
      throw new Error('This account uses Google login. Please login with Google.');
    }

    const isMatch = await bcrypt.compare(dto.password, userRow.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const user: User = {
      id: userRow.id,
      email: userRow.email,
      displayName: userRow.display_name,
      avatarUrl: userRow.avatar_url || undefined,
      bio: userRow.bio || undefined,
      role: userRow.role,
      googleId: userRow.google_id || undefined,
      createdAt: userRow.created_at,
      updatedAt: userRow.updated_at,
    };

    const token = this.generateToken(user);
    return { user, token };
  }

  static async findUserById(id: string): Promise<User | null> {
    const result = await db.query(
      `SELECT id, email, display_name, avatar_url, bio, role, google_id, created_at, updated_at 
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
      googleId: row.google_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static getGoogleAuthUrl(): string {
    return googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      prompt: 'consent'
    });
  }

  static async handleGoogleCallback(code: string): Promise<{ user: User; token: string }> {
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    if (!tokens.id_token) {
      throw new Error('Google authentication failed: no id_token returned');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Google authentication failed: invalid profile payload');
    }

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const displayName = payload.name || payload.given_name || 'Google User';
    const avatarUrl = payload.picture;

    // Check if user exists by google_id
    let result = await db.query(
      'SELECT id, email, display_name, avatar_url, bio, role, google_id, created_at, updated_at FROM users WHERE google_id = $1',
      [googleId]
    );

    // If not, check if user exists by email (link Google ID if they register with email first)
    if (!result.rowCount || result.rowCount === 0) {
      result = await db.query(
        'SELECT id, email, display_name, avatar_url, bio, role, google_id, created_at, updated_at FROM users WHERE email = $1',
        [email]
      );

      if (result.rowCount && result.rowCount > 0) {
        // Link google account
        const userId = result.rows[0].id;
        await db.query(
          'UPDATE users SET google_id = $1, avatar_url = COALESCE(avatar_url, $2) WHERE id = $3',
          [googleId, avatarUrl, userId]
        );
        // Fetch again to get updated user
        result = await db.query(
          'SELECT id, email, display_name, avatar_url, bio, role, google_id, created_at, updated_at FROM users WHERE id = $1',
          [userId]
        );
      } else {
        // Create new user
        result = await db.query(
          `INSERT INTO users (email, display_name, avatar_url, google_id)
           VALUES ($1, $2, $3, $4)
           RETURNING id, email, display_name, avatar_url, bio, role, google_id, created_at, updated_at`,
          [email, displayName, avatarUrl, googleId]
        );
      }
    }

    const userRow = result.rows[0];
    const user: User = {
      id: userRow.id,
      email: userRow.email,
      displayName: userRow.display_name,
      avatarUrl: userRow.avatar_url || undefined,
      bio: userRow.bio || undefined,
      role: userRow.role,
      googleId: userRow.google_id || undefined,
      createdAt: userRow.created_at,
      updatedAt: userRow.updated_at,
    };

    const token = this.generateToken(user);
    return { user, token };
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
  }
}
export default AuthService;
