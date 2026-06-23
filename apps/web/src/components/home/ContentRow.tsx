import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Content } from '@lumen/core';
import { ContentCard } from '@/components/content/ContentCard';
import { ContentCardSkeleton } from '@/components/content/ContentCardSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentRowProps {
    title: string;
    content: Content[];
    isLoading: boolean;
    showRank?: boolean;
    priority?: boolean;
    seeMoreLink?: string;
    onInfo?: (content: Content) => void;
}

const SCROLL_AMOUNT = 400;

export function ContentRow({
    title,
    content,
    isLoading,
    showRank = false,
    priority = false,
    seeMoreLink,
    onInfo,
}: ContentRowProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const scrollLeft = () => {
        scrollContainerRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollContainerRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    };

    if (isLoading || content.length === 0) {
        return (
            <div className="px-4 lg:px-8">
                <div className="h-5 w-48 bg-surface-interactive rounded mb-4" />
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ContentCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 lg:px-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                {seeMoreLink && (
                    <Link to={seeMoreLink} className="text-sm text-accent hover:underline">
                        See all
                    </Link>
                )}
            </div>

            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
                >
                    {content.map((item, index) => (
                        <div key={item.id} className="snap-start shrink-0">
                            <ContentCard
                                content={item}
                                showRank={showRank}
                                rank={showRank ? index + 1 : undefined}
                                priority={priority && index < 4}
                                onInfo={onInfo}
                            />
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {isHovered && (
                        <>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                onClick={scrollLeft}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full w-10 h-10 flex items-center justify-center z-20 shadow-lg"
                                aria-label="Scroll left"
                            >
                                ‹
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                onClick={scrollRight}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full w-10 h-10 flex items-center justify-center z-20 shadow-lg"
                                aria-label="Scroll right"
                            >
                                ›
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}