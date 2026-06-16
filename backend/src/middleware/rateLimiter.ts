import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

const store = env.NODE_ENV === 'production'
    ? new RedisStore({
        // @ts-ignore - rate-limit-redis typing expects specific overloads
        sendCommand: (...args: string[]) => redis.call(...args),
    })
    : undefined;

const authMax = env.NODE_ENV === 'production' ? 10 : 100;
const authWindowMs = env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 60 * 1000;

export const authLimiter = rateLimit({
    store,
    windowMs: authWindowMs,
    max: authMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res) => {
        throw ApiError.tooManyRequests();
    },
});

export const apiLimiter = rateLimit({
    store,
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res) => {
        throw ApiError.tooManyRequests();
    },
});

export const analyticsLimiter = rateLimit({
    store,
    windowMs: 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res) => {
        throw ApiError.tooManyRequests();
    },
});