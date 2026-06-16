import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { login as apiLogin, register as apiRegister, logout as apiLogout, refreshToken as apiRefreshToken } from '@lumen/core';
import { queryClient } from '@/lib/queryClient';
import type { User } from '@lumen/core';

// - Auth Store -

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    initializeAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isLoading: true,
            error: null,
            isAuthenticated: false,

            login: async (email, password) => {
                set({ error: null });
                try {
                    const data = await apiLogin(email, password);
                    const user: User = {
                        id: data.user.id,
                        email: data.user.email,
                        displayName: data.user.displayName,
                        avatarUrl: data.user.avatarUrl,
                        createdAt: '',
                        updatedAt: '',
                    };
                    set({ user, accessToken: data.accessToken, isAuthenticated: true, isLoading: false, error: null });
                    window.__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Login failed';
                    set({ error: message, isLoading: false, isAuthenticated: false });
                    throw err;
                }
            },

            register: async (email, password, displayName) => {
                set({ error: null });
                try {
                    const data = await apiRegister(email, password, displayName);
                    const user: User = {
                        id: data.user.id,
                        email: data.user.email,
                        displayName: data.user.displayName,
                        avatarUrl: data.user.avatarUrl,
                        createdAt: '',
                        updatedAt: '',
                    };
                    set({ user, accessToken: data.accessToken, isAuthenticated: true, isLoading: false, error: null });
                    window.__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Registration failed';
                    set({ error: message, isLoading: false, isAuthenticated: false });
                    throw err;
                }
            },

            logout: async () => {
                try {
                    await apiLogout();
                    queryClient.clear();
                } finally {
                    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false, error: null });
                    window.__LUMEN_ACCESS_TOKEN__ = null;
                    useAuthStore.persist.clearStorage();
                }
            },

            refreshToken: async () => {
                try {
                    const data = await apiRefreshToken();
                    set({ accessToken: data.accessToken, isAuthenticated: true });
                    window.__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                    return true;
                } catch {
                    set({ user: null, accessToken: null, isAuthenticated: false, error: null });
                    window.__LUMEN_ACCESS_TOKEN__ = null;
                    return false;
                }
            },

            initializeAuth: async () => {
                const persistedUser = get().user;
                if (!persistedUser) {
                    set({ isLoading: false, isAuthenticated: false });
                    return;
                }
                const success = await get().refreshToken();
                if (!success) {
                    set({ user: null, isAuthenticated: false });
                    useAuthStore.persist.clearStorage();
                } else {
                    set({ isAuthenticated: true });
                }
                set({ isLoading: false });
            },

            setUser: (user) => set({ user, isAuthenticated: !!user && !!get().accessToken }),
            setAccessToken: (token) => {
                set({ accessToken: token, isAuthenticated: !!get().user && !!token });
                window.__LUMEN_ACCESS_TOKEN__ = token;
            },
        }),
        {
            name: 'lumen-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
        }
    )
);

// - UI Store -

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface UIState {
    toasts: Toast[];
    isSearchOpen: boolean;
    activeModal: string | null;
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    toggleSearch: () => void;
    setSearchOpen: (open: boolean) => void;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    toasts: [],
    isSearchOpen: false,
    activeModal: null,
    addToast: (toast) =>
        set((state) => ({
            toasts: [...state.toasts, { id: Date.now().toString(), ...toast }],
        })),
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    setSearchOpen: (open) => set({ isSearchOpen: open }),
    openModal: (modalId) => set({ activeModal: modalId }),
    closeModal: () => set({ activeModal: null }),
}));