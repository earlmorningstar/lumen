import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores';
import { QUERY_KEYS, STALE_TIMES, getWatchHistory, updateWatchProgress } from '@lumen/core';

export function useWatchHistory(page = 1, limit = 20) {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: [...QUERY_KEYS.WATCH_HISTORY, page, limit],
        queryFn: () => getWatchHistory({ page, limit }),
        staleTime: STALE_TIMES.WATCH_HISTORY,
        enabled: !!user,
    });
}

export function useUpdateWatchProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ contentId, progressSec, completed }: { contentId: string; progressSec: number; completed: boolean }) =>
            updateWatchProgress(contentId, progressSec, completed),
        onSuccess: (_data, variables) => {
            if (variables.completed) {
                // Only refetch continue watching when completed
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WATCH_HISTORY });
            }
        },
    });
}

