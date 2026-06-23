import * as contentRepo from './content.repository';
import { ApiError } from '../../utils/ApiError';
import { buildPaginatedResponse } from '../../utils/pagination';

export async function list(params: any) {
    const { data, total } = await contentRepo.findMany(params);
    return buildPaginatedResponse(data, total, params.page, params.limit);
}

export async function getFeatured() {
    return contentRepo.findFeatured();
}

export async function getById(id: string) {
    const content = await contentRepo.findById(id);
    if (!content) throw ApiError.notFound('Content');
    if (content.type === 'series') {
        const episodes = await contentRepo.findEpisodesByContentId(id);
        return { ...content, episodes };
    }
    return content;
}

export async function getTrending(limit = 20) {
    return contentRepo.findTrending(limit);
}

export async function getGenres() {
    return contentRepo.findGenresWithCounts();
}

export async function search(q: string, page: number, limit: number) {
    const { data, total } = await contentRepo.searchByQuery(q, limit, (page - 1) * limit);
    return buildPaginatedResponse(data, total, page, limit);
}

export async function getByGenre(genre: string, page: number, limit: number) {
    const { data, total } = await contentRepo.findByGenre(genre, limit, (page - 1) * limit);
    return buildPaginatedResponse(data, total, page, limit);
}

export async function getRelated(id: string) {
    return contentRepo.findRelated(id);
}

export async function incrementView(id: string) {
    await contentRepo.incrementViewCount(id);
}