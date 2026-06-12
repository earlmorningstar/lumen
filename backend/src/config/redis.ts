import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy(times) {
        if (times > 10) return null;
        return Math.min(times * 200, 2000);
    },
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));
redis.on('reconnecting', () => console.log('Redis reconnecting...'));

export async function testRedisConnection() {
    try {
        await redis.ping();
        return true;
    } catch {
        return false;
    }
}