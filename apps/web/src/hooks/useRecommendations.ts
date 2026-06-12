import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores';
import { QUERY_KEYS, STALE_TIMES, getRecommendedContent } from '@lumen/core';

export function useRecommendations() {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: QUERY_KEYS.CONTENT.RECOMMENDATIONS,
        queryFn: () => getRecommendedContent(user!.id),
        staleTime: STALE_TIMES.RECOMMENDATIONS,
        enabled: !!user,
    });
}