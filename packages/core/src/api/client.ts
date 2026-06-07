import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

export function createApiClient(baseURL: string) {
    const apiClient = axios.create({
        baseURL,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    });

    apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = (window as any).__LUMEN_ACCESS_TOKEN__;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    apiClient.interceptors.response.use(
        (response) => response,
        async (error: AxiosError<ApiError>) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const { data } = await axios.post(
                        `${baseURL}/auth/refresh`,
                        {},
                        { withCredentials: true }
                    );
                    const newAccessToken: string = data.accessToken;
                    (window as any).__LUMEN_ACCESS_TOKEN__ = newAccessToken;
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    window.dispatchEvent(new CustomEvent('lumen:force-logout'));
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return apiClient;
}

export type ApiClient = ReturnType<typeof createApiClient>;