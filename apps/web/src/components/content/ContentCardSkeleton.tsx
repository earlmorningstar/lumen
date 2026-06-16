import { Skeleton } from '@/components/ui';

export function ContentCardSkeleton() {
    return (
        <div className="shrink-0 w-50 space-y-2">
            <Skeleton height="0" className="aspect-video rounded-lg" />
            <Skeleton height="0.875rem" width="75%" />
            <Skeleton height="0.75rem" width="50%" />
        </div>
    );
}