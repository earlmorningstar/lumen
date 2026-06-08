import { lazy } from 'react';

export const HomePage = lazy(() => import('@/pages/HomePage'));
export const PlayerPage = lazy(() => import('@/pages/PlayerPage'));
export const SearchPage = lazy(() => import('@/pages/SearchPage'));
export const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
export const WatchlistPage = lazy(() => import('@/pages/WatchlistPage'));