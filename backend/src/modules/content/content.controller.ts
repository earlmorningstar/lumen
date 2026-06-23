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

export const getGenres = asyncHandler(async (_req: Request, res: Response) => {
    const data = await contentService.getGenres();
    res.json({ data });
});

export const search = asyncHandler(async (req: Request, res: Response) => {
    const { q, page = 1, limit = 20 } = req.query as any;
    const data = await contentService.search(q as string, parseInt(page), parseInt(limit));
    res.json(data);
});

export const getByGenre = asyncHandler(async (req: Request, res: Response) => {
    const genre = req.params.genre as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await contentService.getByGenre(genre, page, limit);
    res.json(data);
});

export const getRelated = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = await contentService.getRelated(id);
    res.json({ data });
});

export const incrementView = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await contentService.incrementView(id);
    res.json({ message: 'View counted' });
});