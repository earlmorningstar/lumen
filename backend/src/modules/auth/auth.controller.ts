import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as authService from './auth.service';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: (env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth/refresh',
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, displayName } = req.body;
    const { user, accessToken, refreshToken } = await authService.register(email, password, displayName);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(201).json({
        user: { id: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url },
        accessToken,
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
        user: { id: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url },
        accessToken,
    });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
        throw ApiError.unauthorized('Refresh token missing');
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(oldRefreshToken);

    res.cookie('refreshToken', newRefreshToken, cookieOptions);
    res.status(200).json({ accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    const userId = req.user!.id;

    await authService.logout(userId, refreshToken);

    res.clearCookie('refreshToken', { path: cookieOptions.path });
    res.status(200).json({ message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.id);
    res.status(200).json({ data: user });
});