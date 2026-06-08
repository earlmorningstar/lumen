import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores'
import { ROUTES } from '@/router/routes';
import FullPageSkeleton from '@/components/ui/FullPageSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <FullPageSkeleton />;
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}