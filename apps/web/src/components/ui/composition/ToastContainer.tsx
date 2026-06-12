import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/lib/stores';
import { Toast } from './Toast';

export function ToastContainer() {
    const { toasts, removeToast } = useUIStore();

    if (typeof window === 'undefined') return null;

    return createPortal(
        <div className="fixed bottom-0 right-0 z-200 p-4 flex flex-col-reverse gap-3 max-w-full sm:max-w-sm">
            <AnimatePresence initial={false}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onDismiss={removeToast}
                    />
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
}