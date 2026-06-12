import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive: boolean) {
    const containerRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    useEffect(() => {
        if (!isActive) return;
        previousActiveElement.current = document.activeElement;

        const container = containerRef.current;
        if (!container) return;

        const focusable = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last?.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first?.focus();
                    }
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);
        first?.focus();

        return () => {
            container.removeEventListener('keydown', handleKeyDown);
            // Restore focus
            (previousActiveElement.current as HTMLElement)?.focus?.();
        };
    }, [isActive]);

    return containerRef;
}