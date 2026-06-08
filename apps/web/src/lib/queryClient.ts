import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { STALE_TIMES, GC_TIMES } from '@lumen/core';
import { env } from '@/lib/env';

// Custom error handler
const onError = (error: unknown) => {
    if (env.APP_ENV === 'development') {
        console.error('[React Query Error]', error);
    }
    // In production, I'll be sending to Sentry or other logger
    // Sentry.captureException(error);
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIMES.CONTENT_FEED,
            gcTime: GC_TIMES.DEFAULT,
            retry: (failureCount: number, error: unknown) => {
                // Don't retry on 401 or 404 (Axios error shape check)
                if (
                    error !== null &&
                    typeof error === 'object' &&
                    'response' in error
                ) {
                    const err = error as { response?: { status?: number } };
                    if (err.response?.status === 401 || err.response?.status === 404) {
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
            onError,
            retry: 0,
        },
    },
    queryCache: new QueryCache({
        onError,
    }),
    mutationCache: new MutationCache({
        onError,
    }),
});