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
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            {/* Genre badges */}
            <div className="flex gap-1 mb-2">
                {content.genre.slice(0, 2).map((g) => (
                    <GenreBadge key={g} genre={g} />
                ))}
            </div>

            <h3 className="text-sm font-semibold line-clamp-2 mb-1">{content.title}</h3>
            <ContentMetadata
                year={content.releaseYear}
                durationSec={content.durationSec}
                rating={content.rating}
                size="sm"
            />

            <div className="flex gap-2 mt-3">
                <Button
                    size="icon"
                    variant="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(buildPlayerRoute(content.id));
                    }}
                    aria-label="Play"
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
                    aria-label={isInWatchlist(content.id) ? 'Remove from list' : 'Add to list'}
                >
                    {isInWatchlist(content.id) ? '✓' : '＋'}
                </Button>
                <Button
                    size="icon"
                    variant="glass"
                    onClick={(e) => {
                        e.stopPropagation();
                        onInfo();
                    }}
                    aria-label="More info"
                >
                    ⓘ
                </Button>
            </div>
        </div>
    );
}