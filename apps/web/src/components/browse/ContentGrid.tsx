import type { Content } from '@lumen/core';
import { ContentCard } from '@/components/content/ContentCard';
import { ContentCardSkeleton } from '@/components/content/ContentCardSkeleton';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';

interface ContentGridProps {
    content: Content[];
    isLoading: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;
    onInfo?: (content: Content) => void;
}

export function ContentGrid({ content, isLoading, hasMore, onLoadMore, isLoadingMore, onInfo }: ContentGridProps) {

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-5 gap-y-8">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-full">
                        <ContentCardSkeleton />
                    </div>
                ))}
            </div>
        );
    }

    if (content.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 rounded-2xl bg-zinc-900/20 border border-zinc-900 max-w-xl mx-auto space-y-4"
            >
                <div className="text-4xl filter grayscale opacity-60">🎬</div>
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-zinc-200">No matching titles detected</h3>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                        We couldn't track down content matching this combination. Adjust your catalog filters or try again.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Main Visual Responsive Grid Mapping Node */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-5 gap-y-8">
                {content.map((item) => (
                    <div key={item.id} className="w-full flex justify-center">
                        <ContentCard
                            content={item}
                            onInfo={onInfo}
                            style={{ width: '100%' }} // Override explicit pixel width default to inherit modular grid space
                        />
                    </div>
                ))}
            </div>

            {/* Premium Pagination Command Layer */}
            {hasMore && (
                <div className="flex justify-center pt-4 border-t border-zinc-900/40">
                    <Button
                        variant="secondary"
                        onClick={onLoadMore}
                        isLoading={isLoadingMore}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white px-8 py-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg"
                    >
                        Load More Content
                    </Button>
                </div>
            )}
        </div>
    );
}