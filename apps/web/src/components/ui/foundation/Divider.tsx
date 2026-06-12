interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    label?: string;
    className?: string;
}

export function Divider({ orientation = 'horizontal', label, className = '' }: DividerProps) {
    if (orientation === 'vertical') {
        return <div className={`w-px bg-border-default self-stretch ${className}`} />;
    }

    if (label) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <div className="flex-1 h-px bg-border-default" />
                <span className="text-sm text-text-muted">{label}</span>
                <div className="flex-1 h-px bg-border-default" />
            </div>
        );
    }

    return <div className={`h-px bg-border-default ${className}`} />;
} 