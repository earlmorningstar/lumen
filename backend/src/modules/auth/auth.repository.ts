import { query } from '../../config/database';
import type { User, UserSession } from '../../types';

// Extend User type to include password_hash for internal use
interface UserWithHash extends User {
    password_hash: string;
}

export async function createUser(data: {
    email: string;
    passwordHash: string;
    displayName: string;
}): Promise<User> {
    const users = await query<User>(
        `INSERT INTO users (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, display_name, avatar_url, created_at, updated_at`,
        [data.email, data.passwordHash, data.displayName]
    );
    return users[0];
}

export async function findUserByEmail(email: string): Promise<UserWithHash | null> {
    const users = await query<UserWithHash>(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return users[0] || null;
}

export async function findUserById(id: string): Promise<User | null> {
    const users = await query<User>(
        'SELECT id, email, display_name, avatar_url, created_at, updated_at FROM users WHERE id = $1',
        [id]
    );
    return users[0] || null;
}

export async function createSession(data: {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    family: string;
}): Promise<UserSession> {
    const sessions = await query<UserSession>(
        `INSERT INTO user_sessions (user_id, refresh_token, expires_at, family)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [data.userId, data.refreshToken, data.expiresAt, data.family]
    );
    return sessions[0];
}

export async function findSessionByToken(refreshToken: string): Promise<UserSession | null> {
    const sessions = await query<UserSession>(
        'SELECT * FROM user_sessions WHERE refresh_token = $1',
        [refreshToken]
    );
    return sessions[0] || null;
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await query('DELETE FROM user_sessions WHERE id = $1', [sessionId]);
}

export async function invalidateSessionFamily(family: string): Promise<void> {
    await query('DELETE FROM user_sessions WHERE family = $1', [family]);
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
    await query('DELETE FROM user_sessions WHERE user_id = $1', [userId]);
}

export async function cleanExpiredSessions(): Promise<void> {
    await query('DELETE FROM user_sessions WHERE expires_at < NOW()');
}