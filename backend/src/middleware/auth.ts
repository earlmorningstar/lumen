import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { get, set, CacheKeys } from '../utils/cache';
import { query } from '../config/database';
import { ApiError } from '../utils/ApiError';
import type { User } from '../types';

export interface AuthRequest extends Request {
    user?: User;
}

async function getUserById(userId: string): Promise<User | null> {
    const cached = await get<User>(CacheKeys.user(userId));
    if (cached) return cached;

    const users = await query<User>('SELECT * FROM users WHERE id = $1', [userId]);
    const user = users[0] || null;
    if (user) {
        await set(CacheKeys.user(userId), user, 300);
    }
    return user;
}

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(ApiError.unauthorized('Authentication required'));
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (!payload) {
        return next(ApiError.unauthorized('Invalid or expired token'));
    }

    const user = await getUserById(payload.userId);
    if (!user) {
        return next(ApiError.unauthorized('User not found'));
    }

    req.user = user;
    next();
};

export const authenticateOptional = async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (payload) {
        const user = await getUserById(payload.userId);
        if (user) req.user = user;
    }
    next();
};