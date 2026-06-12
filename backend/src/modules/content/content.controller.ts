import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as contentService from './content.service';

export const list = asyncHandler(async (req: Request, res: Response) => {
    const params = req.validatedQuery || req.query;
    const data = await contentService.list(params);
    res.json(data);
});

export const getFeatured = asyncHandler(async (_req: Request, res: Response) => {
    const data = await contentService.getFeatured();
    res.json({ data });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = await contentService.getById(id);
    res.json({ data });
});

export const getTrending = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await contentService.getTrending(limit);
    res.json({ data });
});