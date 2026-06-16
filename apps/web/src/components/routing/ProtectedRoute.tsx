import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores';
import { ROUTES } from '@/router/routes';
import FullPageSkeleton from '@/components/ui/FullPageSkeleton';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated,
    // user, 
    // accessToken 
  } = useAuthStore();
  const location = useLocation();


  if (isLoading) {
    return <FullPageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}