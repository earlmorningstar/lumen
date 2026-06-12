import { redis } from '../config/redis';

export async function get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
}

export async function set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export async function del(key: string): Promise<void> {
    await redis.del(key);
}

export async function exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
}

export const CacheKeys = {
    user: (userId: string) => `lumen:user:${userId}`,
    contentFeed: (segment: string) => `lumen:content:feed:${segment}`,
    watchPosition: (userId: string, contentId: string) => `lumen:watch:${userId}:${contentId}`,
    refreshToken: (userId: string) => `lumen:refresh:${userId}`,
    contentById: (contentId: string) => `lumen:content:${contentId}`,
    featured: 'lumen:content:featured',
    trending: 'lumen:content:trending',
};