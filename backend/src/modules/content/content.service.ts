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