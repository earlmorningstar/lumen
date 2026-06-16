import { Modal, Skeleton, Button, Badge } from '@/components/ui';
import { useContentById } from '@lumen/core';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '@/hooks/useWatchlist';
import { buildPlayerRoute } from '@/router/routes';
import { formatDuration } from '@lumen/core';
import { ContentMetadata } from './ContentMetadata';
import type { Content, Episode } from '@lumen/core';

interface ContentDetailModalProps {
    contentId: string;
    isOpen: boolean;
    onClose: () => void;
}

type ContentWithEpisodes = Content & { episodes?: Episode[] };

export function ContentDetailModal({ contentId, isOpen, onClose }: ContentDetailModalProps) {
    const { data, isLoading } = useContentById(contentId);
    const content = data as ContentWithEpisodes | undefined;
    const navigate = useNavigate();
    const { isInWatchlist, toggleWatchlist } = useWatchlist();

    if (!content) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isLoading ? '' : content.title}>
            {isLoading ? (
                <Skeleton.Card />
            ) : (
                <>
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                        <img src={content.backdropUrl || content.thumbnailUrl} alt={content.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-background-card/90 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4">
                            <h2 className="font-display text-3xl">{content.title}</h2>
                            <ContentMetadata year={content.releaseYear} durationSec={content.durationSec} rating={content.rating} size="md" />
                        </div>
                    </div>

                    <p className="text-text-secondary mb-4">{content.description}</p>

                    <div className="flex gap-2 mb-4">
                        {content.genre.map((g) => (
                            <Badge key={g} variant="glass">{g}</Badge>
                        ))}
                    </div>

                    <div className="flex gap-3 mb-6">
                        <Button
                            variant="primary"
                            leftIcon={<span>▶</span>}
                            onClick={() => { navigate(buildPlayerRoute(content.id)); onClose(); }}
                        >
                            Watch Now
                        </Button>
                        <Button
                            variant="glass"
                            onClick={() => toggleWatchlist.mutate(content.id)}
                        >
                            {isInWatchlist(content.id) ? '✓ In My List' : '＋ My List'}
                        </Button>
                    </div>

                    {/* Episodes for series */}
                    {content.type === 'series' && content.episodes && content.episodes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Episodes</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {content.episodes.map((ep: Episode) => (
                                    <div
                                        key={ep.id}
                                        className="flex items-center justify-between p-3 bg-surface-interactive rounded-lg hover:bg-background-elevated cursor-pointer"
                                        onClick={() => { navigate(buildPlayerRoute(content.id) + `?episode=${ep.id}`); onClose(); }}
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{ep.episode}. {ep.title}</p>
                                            <p className="text-xs text-text-muted">{formatDuration(ep.durationSec)}</p>
                                        </div>
                                        <span className="text-text-muted">▶</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
}