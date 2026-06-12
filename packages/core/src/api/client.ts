import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError } from '../types';

// Auth store interface expected by the interceptor
interface AuthStore {
    getAccessToken: () => string | null;
    setAccessToken: (token: string) => void;
    refreshToken: () => Promise<boolean>;
    logout: () => Promise<void>;
}

// Exported instance - will be set by initApiClient()
let apiClientInstance: ReturnType<typeof axios.create> | null = null;

// Refresh lock to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshSuccess(token: string) {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}

function onRefreshFailure() {
    refreshSubscribers = [];
}

export function initApiClient(baseURL: string, authStore: AuthStore) {
    const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    });

    // Request interceptor: inject token
    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = authStore.getAccessToken();
        if (token && config.headers) {
            // Skip token for auth endpoints (login/register)
            if (!config.url?.includes('/auth/login') && !config.url?.includes('/auth/register')) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    });

    // Response interceptor: handle token refresh on 401
    client.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError<ApiError>) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            if (error.response?.status === 401 && !originalRequest._retry) {
                // If already refreshing, queue this request
                if (isRefreshing) {
                    return new Promise<AxiosResponse>((resolve, reject) => {
                        refreshSubscribers.push((token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(client(originalRequest));
                        });
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const success = await authStore.refreshToken();
                    if (success) {
                        const newToken = authStore.getAccessToken()!;
                        onRefreshSuccess(newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return client(originalRequest);
                    } else {
                        onRefreshFailure();
                        await authStore.logout();
                        return Promise.reject(error);
                    }
                } catch {
                    onRefreshFailure();
                    await authStore.logout();
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );

    apiClientInstance = client;
    return client;
}

// Getter that throws if not initialized
export function getApiClient() {
    if (!apiClientInstance) {
        throw new Error('API client not initialized. Call initApiClient() first.');
    }
    return apiClientInstance;
}