import { getApiClient } from './client';
import type { Content } from '../types';

export async function getRecommendations(userId: string) {
    const { data } = await getApiClient().get(`/recommendations/${userId}`);
    return data.data as Content[];
}