import { getApiClient } from './client';
import type { User, UserPreferences, WatchHistory, WatchlistItem, UserRating, PaginatedResponse } from '../types';

export async function getUserProfile(userId: string) {
    const { data } = await getApiClient().get(`/users/${userId}`);
    return data.data as User;
}

export async function updateProfile(userId: string, profile: { displayName?: string; avatarUrl?: string }) {
    const { data } = await getApiClient().patch(`/users/${userId}`, profile);
    return data.data as User;
}

export async function updatePreferences(prefs: UserPreferences) {
    const { data } = await getApiClient().put('/users/me/preferences', prefs);
    return data.data as UserPreferences;
}

export async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await getApiClient().post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data as { avatarUrl: string };
}

export async function getWatchHistory(params?: { page?: number; limit?: number }) {
    const { data } = await getApiClient().get('/watch/history', { params });
    return data as PaginatedResponse<WatchHistory>;
}

export async function addToWatchHistory(entry: { contentId: string; episodeId?: string; progressSec: number; completed: boolean }) {
    const { data } = await getApiClient().post('/watch/history', entry);
    return data.data as WatchHistory;
}

export async function updateWatchProgress(contentId: string, progressSec: number, completed: boolean) {
    const { data } = await getApiClient().patch('/watch/progress', { contentId, progressSec, completed });
    return data.data as WatchHistory;
}

export async function getWatchlist() {
    const { data } = await getApiClient().get('/watchlist');
    return data.data as WatchlistItem[];
}

export async function addToWatchlist(contentId: string) {
    const { data } = await getApiClient().post('/watchlist', { contentId });
    return data.data as WatchlistItem;
}

export async function removeFromWatchlist(contentId: string) {
    await getApiClient().delete(`/watchlist/${contentId}`);
}

export async function rateContent(contentId: string, rating: number) {
    const { data } = await getApiClient().post('/ratings', { contentId, rating });
    return data.data as UserRating;
}