import { getApiClient } from './client';
import type { Content, Episode, ContentWithProgress, PaginatedResponse } from '../types';
import { mapContent, mapContentList } from '../utils/apiHelpers';

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
    return {
        ...data,
        data: mapContentList(data.data),
    } as PaginatedResponse<Content>;
}

export async function getFeaturedContent() {
    const { data } = await getApiClient().get('/content/featured');
    return mapContentList(data.data);
}

export async function getContentById(id: string) {
    const { data } = await getApiClient().get(`/content/${id}`);
    const content = mapContent(data.data);
    if (content.type === 'series' && data.data.episodes) {
        (content as any).episodes = data.data.episodes; // episodes come as-is from backend
    }
    return content;
}

export async function getTrendingContent(limit = 20) {
    const { data } = await getApiClient().get('/content/trending', { params: { limit } });
    return mapContentList(data.data);
}

export async function getContentByGenre(genre: string, params?: Omit<ContentFeedParams, 'genre'>) {
    const { data } = await getApiClient().get('/content', {
        params: { ...params, genre },
    });
    return {
        ...data,
        data: mapContentList(data.data),
    } as PaginatedResponse<Content>;
}

export async function searchContent(query: string, params?: Omit<ContentFeedParams, 'search'>) {
    const { data } = await getApiClient().get('/content', {
        params: { ...params, search: query },
    });
    return {
        ...data,
        data: mapContentList(data.data),
    } as PaginatedResponse<Content>;
}

export async function getRecommendedContent(userId: string) {
    const { data } = await getApiClient().get(`/recommendations/${userId}`);
    return mapContentList(data.data);
}

export async function getContinueWatching(userId: string) {
    const { data } = await getApiClient().get(`/users/${userId}/continue-watching`);
    return data.data as ContentWithProgress[];
}

export async function getGenres() {
    const { data } = await getApiClient().get('/content/genres');
    return data as { data: { genre: string; count: number; thumbnailUrl: string }[] };
}