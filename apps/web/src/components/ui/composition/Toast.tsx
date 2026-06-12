import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { slideInFromRight } from '@/lib/motion';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onDismiss: (id: string) => void;
}

interface IconProps {
    className?: string;
}

function CheckIcon({ className }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? 'w-5 h-5'}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
    );
}

function XIcon({ className }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? 'w-5 h-5'}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
    );
}

function WarningIcon({ className }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? 'w-5 h-5'}>
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
    );
}

function InfoIcon({ className }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? 'w-5 h-5'}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
    );
}

const typeConfig: Record<ToastType, { icon: ReactNode; borderColor: string; bgIcon: string }> = {
    success: { icon: <CheckIcon />, borderColor: 'border-l-status-success', bgIcon: 'text-status-success' },
    error: { icon: <XIcon />, borderColor: 'border-l-status-error', bgIcon: 'text-status-error' },
    warning: { icon: <WarningIcon />, borderColor: 'border-l-status-warning', bgIcon: 'text-status-warning' },
    info: { icon: <InfoIcon />, borderColor: 'border-l-status-info', bgIcon: 'text-status-info' },
};

export function Toast({ id, message, type, duration = 4000, onDismiss }: ToastProps) {
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        if (duration > 0) {
            timerRef.current = setTimeout(() => onDismiss(id), duration);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [id, duration, onDismiss]);

    const { icon, borderColor, bgIcon } = typeConfig[type];

    return (
        <motion.div
            layout
            variants={slideInFromRight}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            className={`
        relative glass border-l-4 ${borderColor} rounded-lg px-4 py-3
        flex items-start gap-3 max-w-sm w-full shadow-lg
      `}
            role="alert"
        >
            <span className={`shrink-0 mt-0.5 ${bgIcon}`}>{icon}</span>
            <p className="flex-1 text-sm">{message}</p>
            <button
                onClick={() => onDismiss(id)}
                className="shrink-0 p-1 rounded-full hover:bg-glass-medium transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-lg overflow-hidden">
                    <div
                        className={`h-full ${borderColor.replace('border-l-', 'bg-')}`}
                        style={{ animation: `toast-progress ${duration}ms linear forwards` }}
                    />
                </div>
            )}
        </motion.div>
    );
}