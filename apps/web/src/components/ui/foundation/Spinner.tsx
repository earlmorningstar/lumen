type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'default' | 'white' | 'muted';

interface SpinnerProps {
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    className?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64,
};

const variantColors: Record<SpinnerVariant, string> = {
    default: 'border-accent/30 border-t-accent',
    white: 'border-white/30 border-t-white',
    muted: 'border-text-muted/30 border-t-text-muted',
};

export function Spinner({ size = 'md', variant = 'default', className = '' }: SpinnerProps) {
    const px = sizeMap[size];

    return (
        <div
            className={`inline-block rounded-full border-2 animate-spin ${variantColors[variant]} ${className}`}
            style={{ width: px, height: px, borderWidth: Math.max(2, px / 8) }}
            role="status"
            aria-label="Loading"
        />
    );
}