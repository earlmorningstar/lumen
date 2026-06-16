import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export function useAuthRedirect() {
    const navigate = useNavigate();
    const location = useLocation();

    const redirectAfterAuth = () => {
        const state = location.state as { from?: string } | null;
        navigate(state?.from || ROUTES.HOME, { replace: true });
    };

    return { redirectAfterAuth };
}