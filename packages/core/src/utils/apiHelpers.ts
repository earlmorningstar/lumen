import type { Content, ApiError } from '../types';
import { AxiosError } from 'axios';

export function transformContent(raw: any): Content {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.description,
        type: raw.type,
        genre: raw.genre ?? [],
        tags: raw.tags ?? [],
        releaseYear: raw.release_year,
        durationSec: raw.duration_sec,
        rating: raw.rating,
        thumbnailUrl: raw.thumbnail_url,
        backdropUrl: raw.backdrop_url,
        hlsUrl: raw.hls_url,
        isFeatured: raw.is_featured,
    };
}

export function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.set(key, String(value));
        }
    });
    return searchParams.toString();
}

export function handleApiError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
        return {
            message: error.response?.data?.error || error.message,
            statusCode: error.response?.status || 500,
        };
    }
    return { message: 'An unexpected error occurred', statusCode: 500 };
}

export function mapContent(raw: any): Content {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.description,
        type: raw.type,
        genre: raw.genre ?? [],
        tags: raw.tags ?? [],
        releaseYear: raw.release_year,
        durationSec: raw.duration_sec,
        rating: raw.rating,
        thumbnailUrl: raw.thumbnail_url,
        backdropUrl: raw.backdrop_url,
        hlsUrl: raw.hls_url,
        isFeatured: raw.is_featured,
    };
}

export function mapContentList(list: any[]): Content[] {
    return list.map(mapContent);
}