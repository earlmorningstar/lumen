import { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants';

export function prefetchContent(queryClient: QueryClient, contentId: string) {
    queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.CONTENT.DETAIL(contentId),
        queryFn: () => import('../api/content.api').then(api => api.getContentById(contentId)),
        staleTime: 5 * 60 * 1000,
    });
}

export function invalidateUserData(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WATCH_HISTORY });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WATCHLIST });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENT.RECOMMENDATIONS });
}

export function optimisticUpdate<T>(
    queryClient: QueryClient,
    key: readonly unknown[],
    updater: (old: T) => T
) {
    const previous = queryClient.getQueryData<T>(key);
    if (previous) {
        queryClient.setQueryData(key, updater(previous));
    }
    return () => {
        if (previous) {
            queryClient.setQueryData(key, previous);
        }
    };
}