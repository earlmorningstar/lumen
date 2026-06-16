import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/lib/stores';
import { ROUTES } from '@/router/routes';


const strengthChecks = [
    { test: (p: string) => p.length >= 8, label: '8+ characters' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'Uppercase letter' },
    { test: (p: string) => /[0-9]/.test(p), label: 'Number' },
    { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'Special character' },
];

interface LocationState {
    from?: string;
}

interface RegisterFormProps {
    onSwitchToLogin: (email: string) => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const register = useAuthStore((s) => s.register);
    const navigate = useNavigate();

    const strengthScore = strengthChecks.filter((c) => c.test(password)).length;
    const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'][strengthScore] || 'Weak';

    // Navigate after successful registration, once the store has updated
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

        const newErrors: Record<string, string> = {};
        if (displayName.trim().length < 2) newErrors.displayName = 'Name must be at least 2 characters';
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
            newErrors.password = 'Password must meet strength requirements';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            await register(email, password, displayName);
            setShouldRedirect(true);
        } catch (err: unknown) {
            const axiosError = err as { response?: { status?: number } };
            const status = axiosError?.response?.status;
            if (status === 409) {
                setErrors({ email: 'An account with this email already exists.' });
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
                label="Display name"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                error={errors.displayName}
                disabled={isLoading}
            />

            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={isLoading}
            />
            {errors.email?.includes('already exists') && (
                <p className="text-xs text-text-muted mt-1">
                    <button
                        type="button"
                        className="text-accent underline"
                        onClick={() => onSwitchToLogin(email)}
                    >
                        Sign in instead?
                    </button>
                </p>
            )}

            <div>
                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                <div className="flex gap-1 mt-2">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-1 flex-1 rounded-full bg-surface-interactive overflow-hidden"
                        >
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${i < strengthScore ? 'bg-accent' : 'bg-transparent'
                                    }`}
                                style={{ width: i < strengthScore ? '100%' : '0%' }}
                            />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-text-muted mt-1">{strengthLabel}</p>
            </div>

            <Input
                label="Confirm password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                disabled={isLoading}
            />

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                Create account
            </Button>
        </form>
    );
}