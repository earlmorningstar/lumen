import { getApiClient } from './client';
import type { User } from '../types';

export async function login(email: string, password: string) {
    const { data } = await getApiClient().post('/auth/login', { email, password });
    return data as { user: User; accessToken: string };
}

export async function register(email: string, password: string, displayName: string) {
    const { data } = await getApiClient().post('/auth/register', { email, password, displayName });
    return data as { user: User; accessToken: string };
}

export async function logout() {
    await getApiClient().post('/auth/logout');
}

export async function refreshToken() {
    const { data } = await getApiClient().post('/auth/refresh');
    return data as { accessToken: string };
}

export async function getMe() {
    const { data } = await getApiClient().get('/auth/me');
    return data.data as User;
}