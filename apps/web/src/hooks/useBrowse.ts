import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useBrowse() {
    const [searchParams, setSearchParams] = useSearchParams();

    const activeGenre = searchParams.get('genre') || null;
    const activeType = searchParams.get('type') as 'movie' | 'series' | null || null;

    const setGenre = useCallback((genre: string | null) => {
        setSearchParams(prev => {
            if (genre) {
                prev.set('genre', genre);
            } else {
                prev.delete('genre');
            }
            return prev;
        });
    }, [setSearchParams]);

    const setType = useCallback((type: 'movie' | 'series' | null) => {
        setSearchParams(prev => {
            if (type) {
                prev.set('type', type);
            } else {
                prev.delete('type');
            }
            return prev;
        });
    }, [setSearchParams]);

    const clearFilters = useCallback(() => {
        setSearchParams({});
    }, [setSearchParams]);

    return { activeGenre, activeType, setGenre, setType, clearFilters };
}