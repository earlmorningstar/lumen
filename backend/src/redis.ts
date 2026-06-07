import Redis from 'ioredis';
import { env } from './env';

let redis: Redis | null = null;

if (env.REDIS_URL) {
    redis = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
        retryStrategy(times) {
            // Stop retrying after 3 attempts
            if (times > 3) return null;
            return Math.min(times * 200, 2000);
        },
    });

    redis.on('connect', () => console.log('Redis connected'));
    redis.on('error', (err: Error) => {
        console.warn('Redis error (non-fatal):', err.message);
    });
}

export default redis;