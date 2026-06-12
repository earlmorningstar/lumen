import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { modalOverlay, modalContent } from '@/lib/motion';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: ModalSize;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full mx-4 h-[90vh]',
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    children,
    footer,
}: ModalProps) {
    const trapRef = useFocusTrap(isOpen);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && closeOnEscape) onClose();
        };
        document.addEventListener('keydown', handleEsc);
        // Lock scroll
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, closeOnEscape]);

    if (typeof window === 'undefined') return null; // SSR safety

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <motion.div
                        variants={modalOverlay}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute inset-0 bg-black/70"
                        onClick={closeOnOverlayClick ? onClose : undefined}
                    />
                    {/* Panel */}
                    <motion.div
                        ref={trapRef}
                        variants={modalContent}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={`
              relative z-10 w-full glass-strong rounded-2xl overflow-hidden
              ${sizeClasses[size]}
              flex flex-col max-h-[90vh]
            `}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? 'modal-title' : undefined}
                        aria-describedby={description ? 'modal-desc' : undefined}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                                <div>
                                    {title && (
                                        <h2 id="modal-title" className="text-xl font-semibold">
                                            {title}
                                        </h2>
                                    )}
                                    {description && (
                                        <p id="modal-desc" className="text-sm text-text-muted mt-1">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-glass-medium transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}
                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5">{children}</div>
                        {/* Footer */}
                        {footer && (
                            <div className="p-5 border-t border-border-subtle flex justify-end gap-3">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}