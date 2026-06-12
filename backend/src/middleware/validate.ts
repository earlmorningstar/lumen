import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

type ValidationTarget = 'body' | 'query' | 'params';

// Extend Request to include validated query
declare global {
    namespace Express {
        interface Request {
            validatedQuery?: any;
        }
    }
}

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const data = schema.parse(req[target]);
            if (target === 'query') {
                // req.query is read-only in Express 5, store in a separate property
                req.validatedQuery = data;
            } else {
                req[target] = data;
            }
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const details = err.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                const error = new ApiError(422, 'Validation failed');
                (error as any).details = details;
                return next(error);
            }
            next(err);
        }
    };
}