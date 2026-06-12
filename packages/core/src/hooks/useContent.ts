import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import * as contentApi from '../api/content.api';
import { QUERY_KEYS, STALE_TIMES } from '../constants';
import type { ContentFeedParams } from '../api/content.api';

export function useContentFeed(params: ContentFeedParams = {}) {
    return useInfiniteQuery({
        queryKey: QUERY_KEYS.CONTENT.ALL,
        queryFn: ({ pageParam = 1 }) => contentApi.getContentFeed({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: STALE_TIMES.CONTENT_FEED,
    });
}

export function useFeaturedContent() {
    return useQuery({
        queryKey: QUERY_KEYS.CONTENT.FEATURED,
        queryFn: contentApi.getFeaturedContent,
        staleTime: STALE_TIMES.CONTENT_FEED,
    });
}

export function useContentById(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.CONTENT.DETAIL(id),
        queryFn: () => contentApi.getContentById(id),
        staleTime: STALE_TIMES.CONTENT_FEED,
        enabled: !!id,
    });
}

export function useTrendingContent(limit = 20) {
    return useQuery({
        queryKey: QUERY_KEYS.CONTENT.TRENDING,
        queryFn: () => contentApi.getTrendingContent(limit),
        staleTime: STALE_TIMES.CONTENT_FEED,
    });
}

export function useSearchContent(query: string) {
    return useQuery({
        queryKey: QUERY_KEYS.CONTENT.SEARCH(query),
        queryFn: () => contentApi.searchContent(query),
        staleTime: 60 * 1000,
        enabled: query.length >= 2,
        placeholderData: (previousData: any) => previousData,
    });
}

export function useContentByGenre(genre: string, params?: Omit<ContentFeedParams, 'genre'>) {
    return useQuery({
        queryKey: QUERY_KEYS.CONTENT.BY_GENRE(genre),
        queryFn: () => contentApi.getContentByGenre(genre, params),
        staleTime: STALE_TIMES.CONTENT_FEED,
    });
}