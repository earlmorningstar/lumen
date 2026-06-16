import { memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

    const handleMouseEnter = () => {
        hoverTimer.current = setTimeout(() => {
            prefetchContent(queryClient, content.id);
        }, 300);
    };

    const handleMouseLeave = () => {
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
            className="group relative shrink-0 rounded-lg overflow-hidden bg-background-card cursor-pointer"
            style={{ width: 200, ...style }}
            whileHover={{ scale: 1.08, zIndex: 10 }}
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

            <ContentCardOverlay content={content} onInfo={handleInfo} />
        </motion.div>
    );
}, (prev, next) =>
    prev.content.id === next.content.id &&
    prev.priority === next.priority &&
    prev.showRank === next.showRank &&
    prev.rank === next.rank
);