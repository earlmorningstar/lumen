import { getApiClient } from './client';
import type { Content, Episode, ContentWithProgress, PaginatedResponse } from '../types';

export interface ContentFeedParams {
    page?: number;
    limit?: number;
    type?: 'movie' | 'series';
    genre?: string;
    search?: string;
    sort?: 'newest' | 'rating' | 'trending';
}

export async function getContentFeed(params: ContentFeedParams) {
    const { data } = await getApiClient().get('/content', { params });
    return data as PaginatedResponse<Content>;
}

export async function getFeaturedContent() {
    const { data } = await getApiClient().get('/content/featured');
    return data.data as Content[];
}

export async function getContentById(id: string) {
    const { data } = await getApiClient().get(`/content/${id}`);
    return data.data as Content & { episodes?: Episode[] };
}

export async function getTrendingContent(limit = 20) {
    const { data } = await getApiClient().get('/content/trending', { params: { limit } });
    return data.data as Content[];
}

export async function getContentByGenre(genre: string, params?: Omit<ContentFeedParams, 'genre'>) {
    const { data } = await getApiClient().get('/content', {
        params: { ...params, genre },
    });
    return data as PaginatedResponse<Content>;
}

export async function searchContent(query: string, params?: Omit<ContentFeedParams, 'search'>) {
    const { data } = await getApiClient().get('/content', {
        params: { ...params, search: query },
    });
    return data as PaginatedResponse<Content>;
}

// These will be used when recommendations/continue watching endpoints are built
export async function getRecommendedContent(userId: string) {
    const { data } = await getApiClient().get(`/recommendations/${userId}`);
    return data.data as Content[];
}

export async function getContinueWatching(userId: string) {
    const { data } = await getApiClient().get(`/users/${userId}/continue-watching`);
    return data.data as ContentWithProgress[];
}