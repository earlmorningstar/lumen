import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/routing/ProtectedRoute';
import PublicOnlyRoute from '@/components/routing/PublicOnlyRoute';
import SuspensePage from '@/components/routing/SuspensePage';
import { ErrorPage as RouteErrorPage } from '@/components/routing/ErrorPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AuthPage from '@/pages/AuthPage';
import {
    HomePage,
    PlayerPage,
    SearchPage,
    ProfilePage,
    WatchlistPage,
} from '@/pages/lazy';
import { ROUTES } from './routes';

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        errorElement: <RouteErrorPage />,
        children: [
            {
                element: (
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: (
                            <SuspensePage variant="page">
                                <HomePage />
                            </SuspensePage>
                        ),
                    },
                    {
                        path: ROUTES.PLAYER,
                        element: (
                            <SuspensePage variant="player">
                                <PlayerPage />
                            </SuspensePage>
                        ),
                    },
                    {
                        path: ROUTES.SEARCH,
                        element: (
                            <SuspensePage variant="page">
                                <SearchPage />
                            </SuspensePage>
                        ),
                    },
                    {
                        path: ROUTES.PROFILE,
                        element: (
                            <SuspensePage variant="page">
                                <ProfilePage />
                            </SuspensePage>
                        ),
                    },
                    {
                        path: ROUTES.WATCHLIST,
                        element: (
                            <SuspensePage variant="page">
                                <WatchlistPage />
                            </SuspensePage>
                        ),
                    },
                ],
            },
            {
                element: (
                    <PublicOnlyRoute>
                        <AuthLayout />
                    </PublicOnlyRoute>
                ),
                children: [
                    { path: ROUTES.AUTH.LOGIN, element: <AuthPage /> },
                    { path: ROUTES.AUTH.REGISTER, element: <AuthPage /> },
                ],
            },
            {
                path: ROUTES.NOT_FOUND,
                element: <NotFoundPage />,
            },
        ],
    },
]);

export default router;