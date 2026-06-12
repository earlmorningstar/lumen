import { useUIStore } from '@/lib/stores';

export function useModal() {
    const activeModal = useUIStore((s) => s.activeModal);
    const openModal = useUIStore((s) => s.openModal);
    const closeModal = useUIStore((s) => s.closeModal);

    return {
        isOpen: (modalId: string) => activeModal === modalId,
        open: openModal,
        close: closeModal,
        activeModal,
    };
}