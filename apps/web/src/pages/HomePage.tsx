import { useFeaturedContent, useTrendingContent, useContentFeed, useContentByGenre } from '@lumen/core';
import { useRecommendations } from '@/hooks/useRecommendations';
import { HeroSection } from '@/components/home/HeroSection';
import { ContentRow } from '@/components/home/ContentRow';
import { HomePageSkeleton } from '@/components/home/HomePageSkeleton';
import { useState } from 'react';
import { ContentDetailModal } from '@/components/content/ContentDetailModal';
import type { Content } from '@lumen/core';

export default function HomePage() {
    const { data: featured, isLoading: heroLoading } = useFeaturedContent();
    const { data: trending } = useTrendingContent();
    const moviesQuery = useContentFeed({ type: 'movie', limit: 20 });
    const seriesQuery = useContentFeed({ type: 'series', limit: 20 });
    const scifiQuery = useContentByGenre('sci-fi', { limit: 20 });
    const actionQuery = useContentByGenre('action', { limit: 20 });
    const { data: recommendations } = useRecommendations();

    const [selectedContent, setSelectedContent] = useState<Content | null>(null);

    const handleInfo = (content: Content) => setSelectedContent(content);

    // Infinite queries: pages array -> each page has .data array
    const moviesData = moviesQuery.data?.pages.flatMap((page) => page.data) ?? [];
    const seriesData = seriesQuery.data?.pages.flatMap((page) => page.data) ?? [];

    // Regular queries: data has .data array
    const scifiData = scifiQuery.data?.data ?? [];
    const actionData = actionQuery.data?.data ?? [];

    if (heroLoading) return <HomePageSkeleton />;

    return (
        <div className="min-h-screen bg-background-page">
            {featured && featured.length > 0 && <HeroSection featured={featured} />}

            <div className="relative z-10 -mt-24 space-y-8 pb-16">
                <ContentRow
                    title="Trending Now"
                    content={trending || []}
                    isLoading={!trending}
                    showRank
                    priority
                    seeMoreLink="/search?sort=trending"
                    onInfo={handleInfo}
                />

                {recommendations && recommendations.length > 0 && (
                    <ContentRow
                        title="Recommended for You"
                        content={recommendations}
                        isLoading={false}
                        seeMoreLink="/search?genre=recommended"
                        onInfo={handleInfo}
                    />
                )}

                <ContentRow
                    title="Movies"
                    content={moviesData}
                    isLoading={moviesQuery.isLoading}
                    seeMoreLink="/search?type=movie"
                    onInfo={handleInfo}
                />

                <ContentRow
                    title="Series"
                    content={seriesData}
                    isLoading={seriesQuery.isLoading}
                    seeMoreLink="/search?type=series"
                    onInfo={handleInfo}
                />

                <ContentRow
                    title="Sci-Fi"
                    content={scifiData}
                    isLoading={scifiQuery.isLoading}
                    seeMoreLink="/search?genre=sci-fi"
                    onInfo={handleInfo}
                />

                <ContentRow
                    title="Action"
                    content={actionData}
                    isLoading={actionQuery.isLoading}
                    seeMoreLink="/search?genre=action"
                    onInfo={handleInfo}
                />
            </div>

            {selectedContent && (
                <ContentDetailModal
                    contentId={selectedContent.id}
                    isOpen={!!selectedContent}
                    onClose={() => setSelectedContent(null)}
                />
            )}

            <footer className="py-8 text-center text-xs text-text-muted">
                © 2026 Lumen. All rights reserved.
            </footer>
        </div>
    );
}