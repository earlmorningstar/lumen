import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export function notFound(_req: Request, _res: Response, next: NextFunction) {
    next(ApiError.notFound('Endpoint'));
}