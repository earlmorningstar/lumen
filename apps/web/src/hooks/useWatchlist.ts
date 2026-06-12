import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores';
import { useToast } from '@/hooks/useToast';
import { QUERY_KEYS, STALE_TIMES, getWatchlist, addToWatchlist, removeFromWatchlist } from '@lumen/core';
import type { WatchlistItem } from '@lumen/core';

export function useWatchlist() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { success, error: toastError } = useToast();

    const watchlistQuery = useQuery<WatchlistItem[]>({
        queryKey: QUERY_KEYS.WATCHLIST,
        queryFn: getWatchlist,
        staleTime: STALE_TIMES.WATCH_HISTORY,
        enabled: !!user,
    });

    const isInWatchlist = (contentId: string) => {
        return watchlistQuery.data?.some((item) => item.contentId === contentId) ?? false;
    };

    const toggleWatchlist = useMutation({
        mutationFn: async (contentId: string) => {
            const currentlyIn = isInWatchlist(contentId);
            if (currentlyIn) {
                await removeFromWatchlist(contentId);
            } else {
                await addToWatchlist(contentId);
            }
            return { contentId, wasIn: currentlyIn };
        },
        onMutate: async (contentId: string) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WATCHLIST });
            const previous = queryClient.getQueryData<WatchlistItem[]>(QUERY_KEYS.WATCHLIST);
            if (previous) {
                const isPresent = previous.some((item) => item.contentId === contentId);
                if (isPresent) {
                    queryClient.setQueryData(QUERY_KEYS.WATCHLIST, previous.filter((item) => item.contentId !== contentId));
                } else {
                    queryClient.setQueryData(QUERY_KEYS.WATCHLIST, [
                        ...previous,
                        { userId: user!.id, contentId, addedAt: new Date().toISOString() },
                    ]);
                }
            }
            return { previous };
        },
        onError: (_err, _contentId, context) => {
            if (context?.previous) {
                queryClient.setQueryData(QUERY_KEYS.WATCHLIST, context.previous);
            }
            toastError('Failed to update watchlist');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WATCHLIST });
        },
        onSuccess: (result) => {
            const message = result.wasIn ? 'Removed from watchlist' : 'Added to watchlist';
            success(message);
        },
    });

    return { watchlist: watchlistQuery.data ?? [], isLoading: watchlistQuery.isLoading, isInWatchlist, toggleWatchlist };
}