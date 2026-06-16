import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/lib/stores';
import { ROUTES } from '@/router/routes';

interface LocationState {
    from?: string;
}

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();

    // Navigate after a successful login, once the store has updated
    useEffect(() => {
        if (shouldRedirect) {
            const state = window.history.state?.usr as LocationState | undefined;
            navigate(state?.from || ROUTES.HOME, { replace: true });
        }
    }, [shouldRedirect, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: 'Please enter a valid email' });
            setIsLoading(false);
            return;
        }
        if (!password) {
            setErrors({ password: 'Password is required' });
            setIsLoading(false);
            return;
        }

        try {
            await login(email, password);
            setShouldRedirect(true);  // triggers useEffect navigation
        } catch (err: unknown) {
            const axiosError = err as { response?: { status?: number } };
            const status = axiosError?.response?.status;
            if (status === 401) {
                setErrors({ password: 'Incorrect email or password' });
            } else if (status === 429) {
                setErrors({ general: 'Too many attempts. Please wait before trying again.' });
            } else {
                setErrors({ general: 'Connection failed. Check your internet.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
                <p className="text-sm text-status-error bg-status-error/10 rounded-lg p-3">
                    {errors.general}
                </p>
            )}

            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={isLoading}
            />

            <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                disabled={isLoading}
                rightIcon={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-muted hover:text-text-primary"
                        tabIndex={-1}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                }
            />

            <div className="text-right">
                <button
                    type="button"
                    className="text-xs text-text-muted hover:text-text-secondary"
                    disabled
                >
                    Forgot password?
                </button>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                Sign in
            </Button>
        </form>
    );
}