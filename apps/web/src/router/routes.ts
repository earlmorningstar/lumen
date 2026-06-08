export const ROUTES = {
    HOME: '/',
    PLAYER: '/watch/:contentId',
    SEARCH: '/search',
    PROFILE: '/profile',
    WATCHLIST: '/watchlist',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    NOT_FOUND: '*',
} as const;

export function buildPlayerRoute(contentId: string): string {
    return `/watch/${contentId}`;
}

export function buildSearchRoute(query: string): string {
    return `/search?q=${encodeURIComponent(query)}`;
}