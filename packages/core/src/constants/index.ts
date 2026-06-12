import type { QualityLevel, PlaybackSpeed } from '../types';

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    CONTENT: {
        LIST: '/content',
        DETAIL: (id: string) => `/content/${id}`,
        FEATURED: '/content/featured',
        SEARCH: '/content/search',
        RECOMMENDATIONS: '/content/recommendations',
    },
    WATCH: {
        HISTORY: '/watch/history',
        PROGRESS: '/watch/progress',
    },
    WATCHLIST: '/watchlist',
    RATINGS: '/ratings',
    ANALYTICS: {
        EVENTS: '/analytics/events',
        METRICS: '/analytics/metrics',
    },
} as const;

// Analytics Event Names
export const ANALYTICS_EVENTS = {
    SESSION_START: 'session_start',
    VIDEO_START: 'video_start',
    VIDEO_PROGRESS: 'video_progress',
    VIDEO_COMPLETE: 'video_complete',
    CONTENT_IMPRESSION: 'content_impression',
    SEARCH_QUERY: 'search_query',
    WATCHLIST_ADD: 'watchlist_add',
} as const;

// Player Config Defaults
export const PLAYER_CONFIG = {
    BUFFER_GOAL_SEC: 60,
    MAX_BUFFER_LENGTH: 30,
    MAX_MAX_BITRATE: 10000000,
    DEFAULT_QUALITY_INDEX: -1, // auto
} as const;

export const QUALITY_LEVELS: QualityLevel[] = [
    { label: 'Auto', height: 0, bitrate: 0, width: 0 },
    { label: '4K', height: 2160, bitrate: 20000000, width: 3840 },
    { label: '1080p', height: 1080, bitrate: 8000000, width: 1920 },
    { label: '720p', height: 720, bitrate: 4000000, width: 1280 },
    { label: '480p', height: 480, bitrate: 1500000, width: 854 },
    { label: '360p', height: 360, bitrate: 800000, width: 640 },
];

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [
    { label: '0.5x', rate: 0.5 },
    { label: '0.75x', rate: 0.75 },
    { label: 'Normal', rate: 1 },
    { label: '1.25x', rate: 1.25 },
    { label: '1.5x', rate: 1.5 },
    { label: '2x', rate: 2 },
];

// React Query Keys
export const QUERY_KEYS = {
    USER: ['user'] as const,
    CONTENT: {
        ALL: ['content'] as const,
        DETAIL: (id: string) => ['content', id] as const,
        FEATURED: ['content', 'featured'] as const,
        TRENDING: ['content', 'trending'] as const,
        SEARCH: (query: string) => ['content', 'search', query] as const,
        RECOMMENDATIONS: ['content', 'recommendations'] as const,
        BY_GENRE: (genre: string) => ['content', 'genre', genre] as const,
    },
    WATCH_HISTORY: ['watchHistory'] as const,
    WATCHLIST: ['watchlist'] as const,
    RATINGS: ['ratings'] as const,
} as const;

// Breakpoints (matches Tailwind screens)
export const BREAKPOINTS = {
    xs: 375,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

// Glass Blur Levels
export const GLASS_BLUR_LEVELS = {
    sm: '12px',
    md: '20px',
    lg: '32px',
    xl: '48px',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
    fast: 100,
    normal: 200,
    slow: 400,
    glacial: 700,
} as const;

//React Query Stale & Gc Times
export const STALE_TIMES = {
    CONTENT_FEED: 5 * 60 * 1000,          // 5 minutes
    WATCH_HISTORY: 30 * 1000,             // 30 seconds
    USER_PROFILE: 10 * 60 * 1000,         // 10 minutes
    RECOMMENDATIONS: 2 * 60 * 1000,       // 2 minutes
} as const;

export const GC_TIMES = {
    DEFAULT: 5 * 60 * 1000,               // 5 minutes
    USER: 30 * 60 * 1000,                 // 30 minutes
    CONTENT: 15 * 60 * 1000,              // 15 minutes
} as const;