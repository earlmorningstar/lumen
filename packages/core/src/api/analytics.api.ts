import { getApiClient } from './client';
import type { AnalyticsEvent, AnalyticsContentMetrics } from '../types';

export async function trackEvents(events: AnalyticsEvent[]) {
    try {
        await getApiClient().post('/analytics/events', { events });
    } catch (error) {
        // Analytics failures should be silent
        console.warn('Failed to track analytics events:', error);
    }
}

export async function getContentMetrics(contentId: string) {
    const { data } = await getApiClient().get(`/analytics/metrics/${contentId}`);
    return data.data as AnalyticsContentMetrics;
}