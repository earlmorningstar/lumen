import { useMemo } from 'react';
import { motion } from 'framer-motion';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    ring?: boolean;
    status?: 'online' | 'offline';
    className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
};

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

const bgColors = [
    '#e5a00d', '#3b82f6', '#22c55e', '#ef4444', '#a855f7',
    '#f97316', '#06b6d4', '#ec4899',
];

export function Avatar({
    src,
    alt = '',
    name,
    size = 'md',
    ring = false,
    status,
    className = '',
}: AvatarProps) {
    const px = sizeMap[size];
    const initials = useMemo(() => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0]?.toUpperCase() || '';
    }, [name]);

    const bgColor = useMemo(() => {
        if (name) {
            const idx = hashString(name) % bgColors.length;
            return bgColors[idx];
        }
        return bgColors[0];
    }, [name]);

    return (
        <div className={`relative inline-flex ${className}`}>
            <motion.div
                className={`
          rounded-full overflow-hidden flex items-center justify-center
          ${ring ? 'ring-2 ring-accent ring-offset-2 ring-offset-background-page' : ''}
        `}
                style={{ width: px, height: px }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15 }}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt || name || 'avatar'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : initials ? (
                    <div
                        className="w-full h-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: bgColor, fontSize: px * 0.4 }}
                    >
                        {initials}
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background-surface text-text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </motion.div>
            {status && (
                <span
                    className={`
            absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background-page
            ${status === 'online' ? 'bg-status-success' : 'bg-text-muted'}
          `}
                />
            )}
        </div>
    );
}