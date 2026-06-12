import { initApiClient, getApiClient } from '@lumen/core';
import { useAuthStore } from '@/lib/stores';
import { env } from '@/lib/env';

const authStore = {
    getAccessToken: () => useAuthStore.getState().accessToken,
    setAccessToken: (token: string) => useAuthStore.getState().setAccessToken(token),
    refreshToken: () => useAuthStore.getState().refreshToken(),
    logout: () => useAuthStore.getState().logout(),
};

initApiClient(env.API_URL, authStore);

export const apiClient = getApiClient();