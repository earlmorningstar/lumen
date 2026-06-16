import { formatDuration } from '@lumen/core';
import { RatingBadge } from './RatingBadge';

interface ContentMetadataProps {
    year?: number;
    durationSec?: number;
    rating?: string;
    size?: 'sm' | 'md';
}

export function ContentMetadata({ year, durationSec, rating, size = 'sm' }: ContentMetadataProps) {
    return (
        <div className={`flex items-center gap-2 text-${size === 'sm' ? 'xs' : 'sm'} text-text-muted`}>
            {year && <span>{year}</span>}
            {year && durationSec && <span>·</span>}
            {durationSec && <span>{formatDuration(durationSec)}</span>}
            {rating && (
                <>
                    <span>·</span>
                    <RatingBadge rating={rating} />
                </>
            )}
        </div>
    );
}