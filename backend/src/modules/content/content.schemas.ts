import { z } from 'zod';

export const contentQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    type: z.enum(['movie', 'series']).optional(),
    genre: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['newest', 'rating', 'trending']).optional().default('newest'),
});

export const contentIdSchema = z.object({
    id: z.string().uuid(),
});