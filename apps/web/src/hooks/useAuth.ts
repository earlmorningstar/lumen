import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores';
import * as authApi from '@lumen/core';

export function useLogin() {
    const { setUser, setAccessToken } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authApi.login(email, password),
        onSuccess: (data) => {
            setUser(data.user);
            setAccessToken(data.accessToken);
        },
    });
}

export function useRegister() {
    const { setUser, setAccessToken } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, password, displayName }: { email: string; password: string; displayName: string }) =>
            authApi.register(email, password, displayName),
        onSuccess: (data) => {
            setUser(data.user);
            setAccessToken(data.accessToken);
        },
    });
}

export function useLogout() {
    const { logout: storeLogout } = useAuthStore();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            storeLogout();
        },
    });
}

export function useRefreshToken() {
    const { setAccessToken } = useAuthStore();

    return useMutation({
        mutationFn: authApi.refreshToken,
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
        },
    });
}