import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useWatchlist } from '@/hooks/useWatchlist';
import { buildPlayerRoute } from '@/router/routes';
import { GenreBadge } from './GenreBadge';
import { ContentMetadata } from './ContentMetadata';
import type { Content } from '@lumen/core';

interface ContentCardOverlayProps {
    content: Content;
    onInfo: () => void;
}

export function ContentCardOverlay({ content, onInfo }: ContentCardOverlayProps) {
    const navigate = useNavigate();
    const { isInWatchlist, toggleWatchlist } = useWatchlist();

    return (
        <div className="absolute inset-0 bg-linear-to-t from-background-page via-background-page/30 to-transparent p-4 flex flex-col justify-end transition-opacity duration-300">

            {/* Upper Badge Placement Frame */}
            <div className="flex flex-wrap gap-1 mb-2">
                {content.genre.slice(0, 2).map((g) => (
                    <GenreBadge key={g} genre={g} />
                ))}
            </div>

            {/* Title Representation */}
            <h3 className="text-sm font-bold tracking-tight text-text-primary line-clamp-2 mb-1.5 leading-snug">
                {content.title}
            </h3>

            {/* Inline Technical Specifications Metadata Row */}
            <ContentMetadata
                year={content.releaseYear}
                durationSec={content.durationSec}
                rating={content.rating}
                size="sm"
            />

            {/* Bottom Floating Dynamic Action Grid */}
            <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/5">
                <Button
                    size="icon"
                    variant="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(buildPlayerRoute(content.id));
                    }}
                    className="h-8 w-8 rounded-lg bg-white text-black hover:bg-zinc-200 shadow-md text-2xs transition-transform active:scale-95 flex items-center justify-center font-bold"
                    aria-label="Play Title"
                >
                    ▶
                </Button>
                <Button
                    size="icon"
                    variant="glass"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist.mutate(content.id);
                    }}
                    className="h-8 w-8 rounded-lg glass border border-border-default hover:bg-glass-medium text-text-primary text-xs flex items-center justify-center font-semibold"
                    aria-label={isInWatchlist(content.id) ? 'Remove from list' : 'Add to list'}
                >
                    {isInWatchlist(content.id) ? '✓' : '＋'}
                </Button>

                {/* Unified Context Details Control Button */}
                <Button
                    size="icon"
                    variant="glass"
                    onClick={(e) => {
                        e.stopPropagation();
                        onInfo();
                    }}
                    className="h-8 w-8 rounded-lg glass border border-border-default hover:bg-glass-medium text-text-primary text-xs ml-auto flex items-center justify-center font-mono"
                    aria-label="Open detailed information overlay"
                >
                    ⓘ
                </Button>
            </div>
        </div>
    );
}