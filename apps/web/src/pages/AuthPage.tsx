import { useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores';
import { AuthFormWrapper } from '@/components/auth/AuthFormWrapper';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ROUTES } from '@/router/routes';


function BackgroundOrbs() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div
                className="absolute w-150 h-150 rounded-full opacity-20 blur-3xl"
                style={{
                    background: 'radial-gradient(circle, #e5a00d 0%, transparent 70%)',
                    top: '-20%',
                    left: '-10%',
                    animation: 'float-slow 12s ease-in-out infinite',
                }}
            />
            <div
                className="absolute w-125 h-125 rounded-full opacity-15 blur-3xl"
                style={{
                    background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
                    bottom: '-15%',
                    right: '-10%',
                    animation: 'float-slow 15s ease-in-out infinite reverse',
                }}
            />
        </div>
    );
}

export default function AuthPage() {
    const { isAuthenticated, isLoading } = useAuthStore();
    const [searchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab') === 'register' ? 'register' : 'login';
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(tabFromUrl);
    const [prefillEmail, setPrefillEmail] = useState('');

    if (isAuthenticated && !isLoading) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    if (isLoading) return null;

    const handleSwitchToLogin = (email: string) => {
        setPrefillEmail(email);
        setActiveTab('login');
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            <BackgroundOrbs />
            <div className="relative z-10 w-full">
                <AuthFormWrapper activeTab={activeTab} onTabChange={setActiveTab}>
                    {activeTab === 'login' ? (
                        <LoginForm prefillEmail={prefillEmail} />
                    ) : (
                        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
                    )}
                </AuthFormWrapper>
            </div>
        </div>
    );
}