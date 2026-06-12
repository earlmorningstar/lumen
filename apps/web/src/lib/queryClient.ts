import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { STALE_TIMES, GC_TIMES } from '@lumen/core';
import { env } from '@/lib/env';
import { useAuthStore } from '@/lib/stores';

function isAxiosError(error: unknown): error is { response?: { status?: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIMES.CONTENT_FEED,
            gcTime: GC_TIMES.DEFAULT,
            retry: (failureCount: number, error: unknown) => {
                if (isAxiosError(error)) {
                    if (error.response?.status === 401 || error.response?.status === 404) {
                        return false;
                    }
                }
                return failureCount < 2;
            },
            retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            onError: (error: unknown) => {
                if (env.APP_ENV === 'development') {
                    console.error('[React Query Error]', error);
                }
            },
        },
    },
    queryCache: new QueryCache({
        onError: (error: unknown) => {
            if (isAxiosError(error) && error.response?.status === 401) {
                const authStore = useAuthStore.getState();
                authStore.refreshToken().then((success) => {
                    if (!success) authStore.logout();
                });
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: unknown) => {
            if (env.APP_ENV === 'development') console.error('[Mutation Error]', error);
        },
    }),
});