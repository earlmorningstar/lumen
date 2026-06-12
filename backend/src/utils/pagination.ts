import { Request } from 'express';

export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}

export function getPaginationParams(req: Request, defaultLimit = 20, maxLimit = 100): PaginationParams {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit as string) || defaultLimit));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}

export function buildPaginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}