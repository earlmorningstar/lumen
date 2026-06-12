import { useUIStore } from '@/lib/stores';

export function useToast() {
    const addToast = useUIStore((state) => state.addToast);
    const removeToast = useUIStore((state) => state.removeToast);

    return {
        success: (message: string, duration?: number) =>
            addToast({ message, type: 'success', duration }),
        error: (message: string, duration?: number) =>
            addToast({ message, type: 'error', duration }),
        info: (message: string, duration?: number) =>
            addToast({ message, type: 'info', duration }),
        warning: (message: string, duration?: number) =>
            addToast({ message, type: 'warning', duration }),
        dismiss: removeToast,
    };
}