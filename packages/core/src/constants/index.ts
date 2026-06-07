export const API_ROUTES = {
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

export const EVENTS = {
    SESSION_START: 'session_start',
    VIDEO_START: 'video_start',
    VIDEO_PROGRESS: 'video_progress',
    VIDEO_COMPLETE: 'video_complete',
    CONTENT_IMPRESSION: 'content_impression',
    SEARCH_QUERY: 'search_query',
    WATCHLIST_ADD: 'watchlist_add',
} as const;

export const QUERY_KEYS = {
    USER: ['user'],
    CONTENT: {
        ALL: ['content'],
        DETAIL: (id: string) => ['content', id],
        FEATURED: ['content', 'featured'],
        SEARCH: (q: string) => ['content', 'search', q],
        RECOMMENDATIONS: ['content', 'recommendations'],
    },
    WATCH_HISTORY: ['watchHistory'],
    WATCHLIST: ['watchlist'],
    RATINGS: ['ratings'],
} as const;

export const STALE_TIMES = {
    CONTENT_LIST: 5 * 60 * 1000, // 5 min
    CONTENT_DETAIL: 10 * 60 * 1000,
    USER: 30 * 60 * 1000,
    WATCH_HISTORY: 2 * 60 * 1000,
} as const;