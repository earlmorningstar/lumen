import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import type { ApiClient } from '../api/client';
import type { User } from '../types';

export interface AuthState {
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
}

export function createAuthStore(apiClient: ApiClient) {
    return create<AuthState>()(
        subscribeWithSelector(
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
                            const { data } = await apiClient.post('/auth/login', { email, password });
                            set({
                                user: data.user,
                                accessToken: data.accessToken,
                                isLoading: false,
                                error: null,
                            });
                            (window as any).__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                        } catch (err: any) {
                            set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
                            throw err;
                        }
                    },

                    register: async (email, password, displayName) => {
                        set({ error: null });
                        try {
                            const { data } = await apiClient.post('/auth/register', { email, password, displayName });
                            set({
                                user: data.user,
                                accessToken: data.accessToken,
                                isLoading: false,
                                error: null,
                            });
                            (window as any).__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                        } catch (err: any) {
                            set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
                            throw err;
                        }
                    },

                    logout: async () => {
                        try {
                            await apiClient.post('/auth/logout');
                        } finally {
                            set({ user: null, accessToken: null, isLoading: false, error: null });
                            (window as any).__LUMEN_ACCESS_TOKEN__ = null;
                        }
                    },

                    refreshToken: async () => {
                        try {
                            const { data } = await apiClient.post('/auth/refresh');
                            set({ accessToken: data.accessToken });
                            (window as any).__LUMEN_ACCESS_TOKEN__ = data.accessToken;
                            return true;
                        } catch {
                            set({ user: null, accessToken: null, error: null });
                            (window as any).__LUMEN_ACCESS_TOKEN__ = null;
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
                            set({ user: null, accessToken: null, error: null });
                            (window as any).__LUMEN_ACCESS_TOKEN__ = null;
                        }
                        set({ isLoading: false });
                    },
                }),
                {
                    name: 'lumen-auth',
                    storage: createJSONStorage(() => localStorage),
                    partialize: (state) => ({ user: state.user }),
                }
            )
        )
    );
}