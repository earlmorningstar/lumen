import { v4 as uuidv4 } from 'uuid';
import * as authRepo from './auth.repository';
import { hashPassword, comparePassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { ApiError } from '../../utils/ApiError';
import { get, set, del, CacheKeys } from '../../utils/cache';
import type { User } from '../../types';

export async function register(email: string, password: string, displayName: string) {
    // Check if email already exists
    const existing = await authRepo.findUserByEmail(email);
    if (existing) {
        throw ApiError.conflict('An account with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await authRepo.createUser({ email, passwordHash, displayName });

    const family = uuidv4();
    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email, family });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await authRepo.createSession({
        userId: user.id,
        refreshToken,
        expiresAt,
        family,
    });

    // Cache user object for 5 minutes
    await set(CacheKeys.user(user.id), user, 300);

    return { user, accessToken, refreshToken };
}

export async function login(email: string, password: string) {
    const userWithHash = await authRepo.findUserByEmail(email);
    if (!userWithHash) {
        throw ApiError.unauthorized('Incorrect email or password');
    }

    const isValid = await comparePassword(password, userWithHash.password_hash);
    if (!isValid) {
        throw ApiError.unauthorized('Incorrect email or password');
    }

    // Remove password_hash before returning
    const { password_hash, ...user } = userWithHash;

    const family = uuidv4();
    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email, family });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepo.createSession({
        userId: user.id,
        refreshToken,
        expiresAt,
        family,
    });

    await set(CacheKeys.user(user.id), user, 300);

    return { user, accessToken, refreshToken };
}

export async function refresh(oldRefreshToken: string) {
    const payload = verifyRefreshToken(oldRefreshToken);
    if (!payload) {
        throw ApiError.unauthorized('Invalid refresh token');
    }

    const { userId, email, family } = payload;

    // Find the old session
    const session = await authRepo.findSessionByToken(oldRefreshToken);
    if (!session) {
        // Token not in DB – replay attack detected: invalidate entire family
        await authRepo.invalidateSessionFamily(family);
        throw ApiError.unauthorized('Session compromised');
    }

    // Check expiration
    if (new Date(session.expires_at) < new Date()) {
        await authRepo.invalidateSession(session.id);
        throw ApiError.unauthorized('Session expired');
    }

    // Rotate: delete old session
    await authRepo.invalidateSession(session.id);

    // Issue new tokens with new family
    const newFamily = uuidv4();
    const newAccessToken = signAccessToken({ userId, email });
    const newRefreshToken = signRefreshToken({ userId, email, family: newFamily });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepo.createSession({
        userId,
        refreshToken: newRefreshToken,
        expiresAt,
        family: newFamily,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
        const session = await authRepo.findSessionByToken(refreshToken);
        if (session) {
            await authRepo.invalidateSession(session.id);
        }
    } else {
        // Logout all sessions
        await authRepo.invalidateAllUserSessions(userId);
    }
    // Clear user cache
    await del(CacheKeys.user(userId));
}

export async function getMe(userId: string) {
    // Check cache first
    const cached = await get<User>(CacheKeys.user(userId));
    if (cached) return cached;

    const user = await authRepo.findUserById(userId);
    if (!user) throw ApiError.notFound('User');

    await set(CacheKeys.user(userId), user, 300);
    return user;
}