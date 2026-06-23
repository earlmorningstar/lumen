import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Content } from '@lumen/core';
import { formatDuration } from '@lumen/core';
import { Button, Badge } from '@/components/ui';
import { useWatchlist } from '@/hooks/useWatchlist';
import { buildPlayerRoute } from '@/router/routes';
import { HeroProgressBar } from './HeroProgressBar';

interface HeroSectionProps {
    featured: Content[];
}

export function HeroSection({ featured }: HeroSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    const navigate = useNavigate();
    const { isInWatchlist, toggleWatchlist } = useWatchlist();

    const current = featured[currentIndex];

    useEffect(() => {
        if (isPaused || featured.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featured.length);
            setAnimKey((prev) => prev + 1);
        }, 6000);
        return () => clearInterval(timer);
    }, [isPaused, featured.length]);

    const goTo = useCallback((index: number) => {
        setCurrentIndex(index);
        setAnimKey((prev) => prev + 1);
    }, []);

    if (!current) return null;

    return (
        <div
            className="relative h-screen w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence>
                <motion.img
                    key={current.id}
                    src={current.backdropUrl}
                    alt={current.title}
                    fetchPriority="high"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                />
            </AnimatePresence>

            <div className="absolute inset-0 bg-linear-to-t from-background-page via-background-page/30 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-background-page/80 via-background-page/30 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent" />

            <div className="absolute left-8 lg:left-16 bottom-1/3 translate-y-1/2 max-w-xl z-10">
                <div className="flex gap-2 mb-4">
                    {current.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="glass" size="sm">{g}</Badge>
                    ))}
                </div>
                <h1 className="font-display text-5xl lg:text-7xl text-white mb-4 leading-tight">
                    {current.title}
                </h1>
                <p className="text-text-secondary text-lg mb-6 line-clamp-3 max-w-md">
                    {current.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-text-muted mb-8">
                    <span>{current.releaseYear}</span>
                    <span>·</span>
                    <span>{formatDuration(current.durationSec)}</span>
                    <span>·</span>
                    <Badge variant="glass" size="sm">{current.rating}</Badge>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<span>▶</span>}
                        onClick={() => navigate(buildPlayerRoute(current.id))}
                    >
                        Watch Now
                    </Button>
                    <Button
                        variant="glass"
                        size="lg"
                        onClick={() => toggleWatchlist.mutate(current.id)}
                    >
                        {isInWatchlist(current.id) ? '✓ My List' : '＋ My List'}
                    </Button>
                </div>
            </div>

            <div className="absolute right-8 lg:right-16 bottom-1/3 translate-y-1/2 flex flex-col gap-3 z-10">
                {featured.map((item, idx) => (
                    <button
                        key={item.id}
                        onClick={() => goTo(idx)}
                        className="transition-all duration-200"
                        aria-label={`Go to ${item.title}`}
                    >
                        <motion.div
                            className={`rounded-full ${idx === currentIndex
                                ? 'bg-accent w-8 h-2'
                                : 'bg-white/40 w-2 h-2 hover:bg-white/70'
                                }`}
                            layoutId="hero-dot"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    </button>
                ))}
            </div>

            <HeroProgressBar key={animKey} isPaused={isPaused} />
        </div>
    );
}