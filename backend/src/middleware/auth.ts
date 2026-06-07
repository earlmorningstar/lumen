import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env';

export interface AuthRequest extends Request {
    userId?: string;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Access token required', statusCode: 401 });
    }

    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
        req.userId = payload.sub;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token', statusCode: 401 });
    }
}