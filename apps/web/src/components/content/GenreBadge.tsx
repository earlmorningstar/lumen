import { Badge } from '@/components/ui';

interface GenreBadgeProps {
    genre: string;
}

export function GenreBadge({ genre }: GenreBadgeProps) {
    return <Badge variant="glass" size="sm">{genre}</Badge>;
}