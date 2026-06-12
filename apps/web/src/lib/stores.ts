import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@lumen/core';
import {
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout,
    refreshToken as apiRefreshToken,
} from '@lumen/core';

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

            get isAuthenticated() {
                return !!get().user && !!get().accessToken;
            },

            login: async (email, password) => {
                set({ error: null });
                try {
                    const data = await apiLogin(email, password);
                    set({ user: data.user, accessToken: data.accessToken, isLoading: false, error: null });
                    window.__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Login failed';
                    set({ error: message, isLoading: false });
                    throw err;
                }
            },

            register: async (email, password, displayName) => {
                set({ error: null });
                try {
                    const data = await apiRegister(email, password, displayName);
                    set({ user: data.user, accessToken: data.accessToken, isLoading: false, error: null });
                    window.__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Registration failed';
                    set({ error: message, isLoading: false });
                    throw err;
                }
            },

            logout: async () => {
                try {
                    await apiLogout();
                } finally {
                    set({ user: null, accessToken: null, isLoading: false, error: null });
                    window.__LUMEN_ACCESS_TOKEN__ = null;
                }
            },

            refreshToken: async () => {
                try {
                    const data = await apiRefreshToken();
                    set({ accessToken: data.accessToken });
                    window.__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                    return true;
                } catch {
                    set({ user: null, accessToken: null, error: null });
                    window.__LUMEN_ACCESS_TOKEN__ = null;
                    return false;
                }
            },

            initializeAuth: async () => {
                const currentUser = get().user;
                if (!currentUser) {
                    set({ isLoading: false });
                    return;
                }
                const success = await get().refreshToken();
                if (!success) {
                    set({ user: null });
                }
                set({ isLoading: false });
            },

            setUser: (user) => set({ user }),
            setAccessToken: (token) => {
                set({ accessToken: token });
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

// -- UI Store --

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface UIState {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
    toasts: [],
    addToast: (toast) =>
        set((state) => ({
            toasts: [...state.toasts, { id: Date.now().toString(), ...toast }],
        })),
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}));