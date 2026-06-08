import { Suspense } from 'react';

type SuspenseVariant = 'page' | 'player' | 'auth';

interface SuspensePageProps {
    variant: SuspenseVariant;
    children: React.ReactNode;
}

function PageSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="skeleton w-16 h-16 rounded-full" />
        </div>
    );
}

function PlayerSkeleton() {
    return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <div className="skeleton w-full max-w-4xl aspect-video rounded-lg" />
        </div>
    );
}

function AuthSkeleton() {
    return (
        <div className="w-full max-w-md p-8">
            <div className="skeleton h-10 w-3/4 mb-4 rounded" />
            <div className="skeleton h-48 w-full rounded glass" />
        </div>
    );
}

const variantComponents: Record<SuspenseVariant, React.FC> = {
    page: PageSkeleton,
    player: PlayerSkeleton,
    auth: AuthSkeleton,
};

export default function SuspensePage({ variant, children }: SuspensePageProps) {
    const SkeletonComponent = variantComponents[variant];
    return <Suspense fallback={<SkeletonComponent />}>{children}</Suspense>;
}