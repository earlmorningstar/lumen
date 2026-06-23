import { useQuery } from '@tanstack/react-query';
import { useContentFeed, getGenres } from '@lumen/core';
import { useBrowse } from '@/hooks/useBrowse';
import { GenreGrid } from '@/components/browse/GenreGrid';
import { GenreFilter } from '@/components/browse/GenreFilter';
import { ContentGrid } from '@/components/browse/ContentGrid';
import { ContentDetailModal } from '@/components/content/ContentDetailModal';
import { useState } from 'react';
import type { Content } from '@lumen/core';

export default function BrowsePage() {
    const { activeGenre, activeType, setGenre, setType } = useBrowse();
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);

    // Fetch genres list for the genre cards
    const { data: genres } = useQuery({
        queryKey: ['genres'],
        queryFn: getGenres,
        staleTime: 30 * 60 * 1000, // 30 min
    });

    // Fetch content based on active filters
    const feedQuery = useContentFeed({
        type: activeType || undefined,
        genre: activeGenre || undefined,
        limit: 24,
    });

    // Flatten infinite query data
    const content = feedQuery.data?.pages.flatMap((page) => page.data) ?? [];

    return (
        <div className="min-h-screen bg-background-page pt-24">
            <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 pb-16">
                <h1 className="font-display text-4xl mb-6">Browse</h1>

                {/* Filter bar (sticky, above everything) */}
                <div className="sticky top-16 z-30 bg-background-page/95 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-8 lg:px-8">
                    <GenreFilter
                        activeGenre={activeGenre}
                        activeType={activeType}
                        onGenreChange={setGenre}
                        onTypeChange={setType}
                    />
                </div>

                {/* Genre grid (only when no genre selected) */}
                {!activeGenre && genres && (
                    <div className="mt-8">
                        <GenreGrid
                            genres={genres.data}
                            onSelect={(genre) => setGenre(genre)}
                        />
                    </div>
                )}

                {/* Content grid */}
                <div className="mt-8">
                    <ContentGrid
                        content={content}
                        isLoading={feedQuery.isLoading}
                        hasMore={feedQuery.hasNextPage}
                        onLoadMore={() => feedQuery.fetchNextPage()}
                        isLoadingMore={feedQuery.isFetchingNextPage}
                        onInfo={(c) => setSelectedContent(c)}
                    />
                </div>
            </div>

            {/* Detail modal */}
            {selectedContent && (
                <ContentDetailModal
                    contentId={selectedContent.id}
                    isOpen={!!selectedContent}
                    onClose={() => setSelectedContent(null)}
                />
            )}
        </div>
    );
}