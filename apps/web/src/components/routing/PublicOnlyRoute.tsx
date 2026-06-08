import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores'
import { ROUTES } from '@/router/routes';

interface PublicOnlyRouteProps {
    children: React.ReactNode;
}

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return null; // or a small spinner; not blocking public routes
    }

    if (isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
}