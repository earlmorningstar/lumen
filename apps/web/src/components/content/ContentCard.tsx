import { memo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Content } from '@lumen/core';
import { queryClient } from '@/lib/queryClient';
import { prefetchContent } from '@lumen/core';
import { buildPlayerRoute } from '@/router/routes';
import { ContentCardOverlay } from './ContentCardOverlay';

interface ContentCardProps {
    content: Content;
    priority?: boolean;
    showRank?: boolean;
    rank?: number;
    onInfo?: (content: Content) => void;
    style?: React.CSSProperties;
}

export const ContentCard = memo(function ContentCard({
    content,
    priority = false,
    showRank = false,
    rank,
    onInfo,
    style,
}: ContentCardProps) {
    const navigate = useNavigate();
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        hoverTimer.current = setTimeout(() => {
            prefetchContent(queryClient, content.id);
        }, 300);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };

    const handleClick = () => {
        navigate(buildPlayerRoute(content.id), { state: { content } });
    };

    const handleInfo = () => {
        onInfo?.(content);
    };

    return (
        <motion.div
            className="relative shrink-0 rounded-lg overflow-hidden bg-background-card cursor-pointer"
            style={{ width: 200, ...style }}
            animate={{ scale: isHovered ? 1.08 : 1, zIndex: isHovered ? 10 : 1 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
        >
            {showRank && rank && (
                <div className="absolute -left-2 bottom-0 font-display text-7xl text-black/20 select-none z-0">
                    {rank}
                </div>
            )}

            <img
                src={content.thumbnailUrl}
                alt={content.title}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                className="w-full aspect-video object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${content.id}/400/225`;
                }}
            />

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 z-10"
                    >
                        <ContentCardOverlay content={content} onInfo={handleInfo} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}, (prev, next) =>
    prev.content.id === next.content.id &&
    prev.priority === next.priority &&
    prev.showRank === next.showRank &&
    prev.rank === next.rank
);