import { Badge } from '@/components/ui';
import type { ComponentProps } from 'react';

interface RatingBadgeProps {
    rating: string;
}

const colorMap: Record<string, ComponentProps<typeof Badge>['variant']> = {
    G: 'success',
    PG: 'success',
    'PG-13': 'warning',
    R: 'error',
    'NC-17': 'error',
};

export function RatingBadge({ rating }: RatingBadgeProps) {
    return <Badge variant={colorMap[rating] || 'default'} size="sm">{rating}</Badge>;
}