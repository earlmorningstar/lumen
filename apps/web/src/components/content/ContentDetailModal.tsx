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
                <div className="p-6">
                    <Skeleton.Card />
                </div>
            ) : (
                <div className="bg-background-card rounded-2xl overflow-hidden border border-border-subtle max-w-full">
                    {/* Hero Backdrop Visual Container */}
                    <div className="relative aspect-video w-full overflow-hidden">
                        <img
                            src={content.backdropUrl || content.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover animate-fadeIn"
                        />
                        {/* Dynamic Core Scrim Gradients */}
                        <div className="absolute inset-0 bg-linear-to-t from-background-card via-background-card/40 to-transparent" />
                        <div className="absolute inset-0 bg-linear-to-r from-background-card/60 via-transparent to-transparent" />

                        {/* Inline Content Title Block */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 space-y-3">
                            <h2 className="font-display text-2xl sm:text-4xl tracking-wide text-text-primary uppercase leading-none">
                                {content.title}
                            </h2>
                            <ContentMetadata
                                year={content.releaseYear}
                                durationSec={content.durationSec}
                                rating={content.rating}
                                size="md"
                            />
                        </div>
                    </div>

                    {/* Meta & Description Layout Grid */}
                    <div className="p-6 lg:p-8 space-y-6">
                        <p className="text-sm text-text-secondary leading-relaxed font-normal max-w-2xl">
                            {content.description}
                        </p>

                        {/* Genre Pill Collection Container */}
                        <div className="flex flex-wrap gap-1.5">
                            {content.genre.map((g) => (
                                <Badge key={g} variant="glass" className="text-2xs uppercase tracking-wider font-semibold font-mono">
                                    {g}
                                </Badge>
                            ))}
                        </div>

                        {/* Interactive Action Control Section */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button
                                variant="primary"
                                leftIcon={<span className="text-xs">▶</span>}
                                onClick={() => {
                                    navigate(buildPlayerRoute(content.id));
                                    onClose();
                                }}
                                className="bg-accent text-black hover:bg-accent-hover font-bold text-xs uppercase tracking-wider rounded-xl px-6 py-3.5 transition-colors"
                            >
                                Watch Now
                            </Button>
                            <Button
                                variant="glass"
                                onClick={() => toggleWatchlist.mutate(content.id)}
                                className="glass hover:bg-glass-medium text-text-primary text-xs font-semibold rounded-xl px-5 py-3.5 transition-all border border-border-default"
                            >
                                {isInWatchlist(content.id) ? '✓ In My List' : '＋ My List'}
                            </Button>
                        </div>

                        {/* Series Episodic Manifest Layer */}
                        {content.type === 'series' && content.episodes && content.episodes.length > 0 && (
                            <div className="pt-6 border-t border-border-subtle space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted font-mono">
                                    Episodes ({content.episodes.length})
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                    {content.episodes.map((ep: Episode) => (
                                        <div
                                            key={ep.id}
                                            onClick={() => {
                                                navigate(buildPlayerRoute(content.id) + `?episode=${ep.id}`);
                                                onClose();
                                            }}
                                            className="group flex items-center justify-between p-3.5 bg-background-surface hover:bg-background-elevated rounded-xl border border-border-subtle cursor-pointer transition-all duration-200"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-semibold text-sm text-text-primary group-hover:text-accent transition-colors">
                                                    <span className="text-text-muted font-mono mr-2 text-xs">{ep.episode.toString().padStart(2, '0')}</span>
                                                    {ep.title}
                                                </p>
                                                <p className="text-2xs font-mono text-text-muted pl-7">
                                                    {formatDuration(ep.durationSec)}
                                                </p>
                                            </div>
                                            <span className="text-text-muted group-hover:text-white transform group-hover:translate-x-0.5 transition-all text-xs pl-4">
                                                ▶
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}