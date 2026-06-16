import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface AccessTokenPayload {
    userId: string;
    email: string;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
    family: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
    const options: SignOptions = {
        expiresIn: env.JWT_ACCESS_EXPIRY as any,
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
    const options: SignOptions = {
        expiresIn: env.JWT_REFRESH_EXPIRY as any,
    };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch {
        return null;
    }
}