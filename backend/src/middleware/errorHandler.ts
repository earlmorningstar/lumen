import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ZodError } from 'zod';
import { env } from '../config/env';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    let statusCode = 500;
    let message = 'Internal server error';
    let code: string | undefined;
    let details: any = undefined;

    if ((err as any).details) {
        details = (err as any).details;
    }

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code;
    } else if (err instanceof ZodError) {
        statusCode = 422;
        message = 'Validation failed';
        details = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
    } else if ((err as any).code) {
        const pgError = err as any;
        if (pgError.code === '23505') {
            statusCode = 409;
            message = 'Resource already exists';
            code = 'DUPLICATE_ENTRY';
        } else if (pgError.code === '23503') {
            statusCode = 400;
            message = 'Referenced resource not found';
            code = 'FOREIGN_KEY_VIOLATION';
        }
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Invalid or expired token';
        code = 'INVALID_TOKEN';
    }

    if (statusCode === 500) {
        console.error('Internal server error:', err);
        if (env.NODE_ENV !== 'production') {
            message = err.message || message;
        }
    }

    const response: any = { error: message };
    if (code) response.code = code;
    if (details) response.details = details;
    if (env.NODE_ENV === 'development' && statusCode === 500) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
}