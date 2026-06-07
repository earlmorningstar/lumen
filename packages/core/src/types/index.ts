// ---- User & Auth ----
export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string; // used for cookie setting logic
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload extends LoginPayload {
    displayName: string;
}

// ---- Content ----
export type ContentType = 'movie' | 'series';

export interface Content {
    id: string;
    title: string;
    description: string;
    type: ContentType;
    genre: string[];
    tags: string[];
    releaseYear: number;
    durationSec: number;
    rating: number; // average rating 0-10
    thumbnailUrl: string;
    backdropUrl: string;
    hlsUrl: string | null; // movie direct; series may have episodes
    isFeatured: boolean;
}

export interface Episode {
    id: string;
    contentId: string;
    season: number;
    episode: number;
    title: string;
    durationSec: number;
    hlsUrl: string;
    thumbnailUrl: string;
}

// ---- Watch & User Data ----
export interface WatchHistoryEntry {
    id: string;
    userId: string;
    contentId: string;
    episodeId?: string;
    progressSec: number;
    completed: boolean;
    lastWatched: string;
}

export interface WatchlistItem {
    userId: string;
    contentId: string;
    addedAt: string;
}

export interface UserRating {
    userId: string;
    contentId: string;
    rating: number; // 1-10
}

export interface UserPreferenceVector {
    userId: string;
    genreWeights: Record<string, number>;
    tagWeights: Record<string, number>;
}

// ---- Analytics ----
export type AnalyticsEventType =
    | 'session_start'
    | 'video_start'
    | 'video_progress'
    | 'video_complete'
    | 'content_impression'
    | 'search_query'
    | 'watchlist_add';

export interface AnalyticsEvent {
    type: AnalyticsEventType;
    userId?: string;
    sessionId: string;
    contentId?: string;
    properties?: Record<string, unknown>;
    timestamp: number; // client-side epoch ms
}

export interface AnalyticsContentMetrics {
    contentId: string;
    totalViews: number;
    totalWatchSec: number;
    completionRate: number;
    avgWatchPct: number;
}

// ---- Player ----
export interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    buffered: TimeRanges | null;
    volume: number;
    muted: boolean;
    playbackRate: number;
    qualityLevel: number; // index in quality levels
    isFullscreen: boolean;
    isMiniPlayer: boolean;
}

// ---- API ----
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}