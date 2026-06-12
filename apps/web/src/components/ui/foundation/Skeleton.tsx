interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
}

export function Skeleton({
    width = '100%',
    height = '1rem',
    borderRadius = '0.375rem',
    className = '',
}: SkeletonProps) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
}

// Compound components
Skeleton.Text = function TextSkeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height="0.875rem" />
            ))}
        </div>
    );
};

Skeleton.Title = function TitleSkeleton({ className = '' }: { className?: string }) {
    return <Skeleton height="1.5rem" width="50%" className={className} />;
};

Skeleton.Avatar = function AvatarSkeleton({ size = 40, className = '' }: { size?: number; className?: string }) {
    return (
        <Skeleton
            width={size}
            height={size}
            borderRadius="50%"
            className={className}
        />
    );
};

Skeleton.Card = function CardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`space-y-3 ${className}`}>
            <Skeleton height="0" className="aspect-video-card" borderRadius="0.5rem" />
            <Skeleton.Text lines={2} />
        </div>
    );
};

Skeleton.Row = function RowSkeleton({ count = 6, className = '' }: { count?: number; className?: string }) {
    return (
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton.Card key={i} />
            ))}
        </div>
    );
};