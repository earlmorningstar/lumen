import { create } from 'zustand';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

interface UIState {
    isMobileNavOpen: boolean;
    activeModal: string | null;
    toasts: Toast[];
    isSearchOpen: boolean;
    openModal: (modalId: string) => void;
    closeModal: () => void;
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    toggleSearch: () => void;
    setMobileNavOpen: (open: boolean) => void;
}

export const createUIStore = () =>
    create<UIState>()((set) => ({
        isMobileNavOpen: false,
        activeModal: null,
        toasts: [],
        isSearchOpen: false,
        openModal: (modalId) => set({ activeModal: modalId }),
        closeModal: () => set({ activeModal: null }),
        addToast: (toast) =>
            set((state) => ({
                toasts: [...state.toasts, { id: Date.now().toString(), ...toast }],
            })),
        removeToast: (id) =>
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            })),
        toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
        setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
    }));