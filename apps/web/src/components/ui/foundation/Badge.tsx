import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'accent' | 'success' | 'error' | 'warning' | 'info' | 'glass';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-background-surface text-text-secondary border-border-default',
    accent: 'bg-accent-muted text-accent border-accent/30',
    success: 'bg-status-success/20 text-status-success border-status-success/30',
    error: 'bg-status-error/20 text-status-error border-status-error/30',
    warning: 'bg-status-warning/20 text-status-warning border-status-warning/30',
    info: 'bg-status-info/20 text-status-info border-status-info/30',
    glass: 'glass text-text-primary',
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-1.5 py-0.5 text-2xs',
    md: 'px-2 py-1 text-xs',
};

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = '',
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}