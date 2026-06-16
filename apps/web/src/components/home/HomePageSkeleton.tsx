import { Skeleton } from '@/components/ui';

export function HomePageSkeleton() {
    return (
        <div className="min-h-screen bg-background-page">
            {/* Hero skeleton */}
            <div className="h-screen bg-background-card" />
            {/* Content rows skeleton */}
            <div className="relative z-10 -mt-24 space-y-8 px-4 lg:px-8 pb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <Skeleton height="1.5rem" width="200px" className="mb-4" />
                        <Skeleton.Row count={6} />
                    </div>
                ))}
            </div>
        </div>
    );
}