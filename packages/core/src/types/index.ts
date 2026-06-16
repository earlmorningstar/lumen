export { };

declare global {
    interface Window {
        __LUMEN_ACCESS_TOKEN__?: string | null;
    }
}

// Enums
export enum ContentType {
    Movie = 'movie',
    Series = 'series',
}

export enum ContentRating {
    G = 'G',
    PG = 'PG',
    PG13 = 'PG-13',
    R = 'R',
    NC17 = 'NC-17',
}

export enum Genre {
    Action = 'action',
    Comedy = 'comedy',
    Drama = 'drama',
    Horror = 'horror',
    SciFi = 'sci-fi',
    Thriller = 'thriller',
    Documentary = 'documentary',
    Animation = 'animation',
    Romance = 'romance',
}

export enum AnalyticsEventType {
    SessionStart = 'session_start',
    VideoStart = 'video_start',
    VideoProgress = 'video_progress',
    VideoComplete = 'video_complete',
    ContentImpression = 'content_impression',
    SearchQuery = 'search_query',
    WatchlistAdd = 'watchlist_add',
}

export enum RequestStatus {
    Idle = 'idle',
    Loading = 'loading',
    Success = 'success',
    Error = 'error',
}

// Content
export interface Content {
    id: string;
    title: string;
    description: string;
    type: ContentType;
    genre: Genre[];
    tags: string[];
    releaseYear: number;
    durationSec: number;
    rating: string; // 0-10 average
    thumbnailUrl: string;
    backdropUrl: string;
    hlsUrl: string | null;
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

export interface ContentWithProgress extends Content {
    progressSec: number;
    completed: boolean;
    lastWatched: string;
}

// User 
export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UserSession {
    id: string;
    userId: string;
    refreshToken: string;
    expiresAt: string;
}

export interface UserPreferences {
    userId: string;
    preferredGenres: Genre[];
    preferredTags: string[];
}

export interface UserPreferenceVector {
    userId: string;
    genreWeights: Record<string, number>;
    tagWeights: Record<string, number>;
}

// Interactions
export interface WatchHistory {
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

// Analytics
export interface AnalyticsEventBase {
    type: AnalyticsEventType;
    userId?: string;
    sessionId: string;
    timestamp: number; // epoch ms
}

export interface SessionEvent extends AnalyticsEventBase {
    type: AnalyticsEventType.SessionStart;
    properties: { device: string; os: string; };
}

export interface VideoProgressEvent extends AnalyticsEventBase {
    type: AnalyticsEventType.VideoProgress;
    contentId: string;
    properties: {
        progressSec: number;
        durationSec: number;
        bufferedSec: number;
        quality: string;
    };
}

export interface VideoCompleteEvent extends AnalyticsEventBase {
    type: AnalyticsEventType.VideoComplete;
    contentId: string;
    properties: { totalWatchSec: number; };
}

export interface ContentImpressionEvent extends AnalyticsEventBase {
    type: AnalyticsEventType.ContentImpression;
    contentId: string;
    properties: { position: number; row: string; };
}

export interface SearchEvent extends AnalyticsEventBase {
    type: AnalyticsEventType.SearchQuery;
    properties: { query: string; resultCount: number; };
}

export interface WatchlistAddEvent extends AnalyticsEventBase {
    type: AnalyticsEventType.WatchlistAdd;
    contentId: string;
}

export type AnalyticsEvent =
    | SessionEvent
    | VideoProgressEvent
    | VideoCompleteEvent
    | ContentImpressionEvent
    | SearchEvent
    | WatchlistAddEvent;

export interface AnalyticsContentMetrics {
    contentId: string;
    totalViews: number;
    totalWatchSec: number;
    completionRate: number;
    avgWatchPct: number;
}

// Recommendations
export interface ContentFeatureVector {
    contentId: string;
    genreVector: number[];
    tagVector: number[];
}

export interface RecommendationScore {
    contentId: string;
    score: number;
}

// Player
export interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    buffered: number;
    volume: number;
    muted: boolean;
    playbackRate: number;
    qualityLevel: number; // index
    isFullscreen: boolean;
    isMiniPlayer: boolean;
}

export interface QualityLevel {
    label: string;
    height: number;
    bitrate: number;
    width: number;
}

export interface PlaybackSpeed {
    label: string;
    rate: number;
}

export interface PlayerConfig {
    autoPlay: boolean;
    muted: boolean;
    defaultQuality: number;
    bufferedGoalSec: number;
}

export interface BufferState {
    start: number;
    end: number;
}

export type PlayerEvent =
    | { type: 'play' }
    | { type: 'pause' }
    | { type: 'seek'; to: number }
    | { type: 'volumechange'; volume: number }
    | { type: 'ratechange'; rate: number }
    | { type: 'qualitychange'; level: number }
    | { type: 'fullscreenchange'; fullscreen: boolean };

// Experiments
export interface Experiment {
    id: string;
    name: string;
    variants: ExperimentVariant[];
    isActive: boolean;
}

export interface ExperimentVariant {
    id: string;
    name: string;
    config: Record<string, unknown>;
}

export interface ExperimentAssignment {
    userId: string;
    experimentId: string;
    variantId: string;
}

// API
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}