import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
    userId: string;
    email: string;
}

export function signAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {
        expiresIn: env.JWT_ACCESS_EXPIRY as any, // Valid string format like '15m'
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = {
        expiresIn: env.JWT_REFRESH_EXPIRY as any,
    };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}