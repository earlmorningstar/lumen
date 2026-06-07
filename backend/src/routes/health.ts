import { Router, Request, Response } from 'express';
import pool from '../db';
import redis from '../redis';

const router: Router = Router();

router.get('/', async (_req: Request, res: Response) => {
    const health: any = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        postgres: 'down',
        redis: 'down',
    };

    try {
        await pool.query('SELECT 1');
        health.postgres = 'up';
    } catch (e) { }

    if (redis) {
        try {
            await redis.ping();
            health.redis = 'up';
        } catch (e) { }
    } else {
        health.redis = 'not configured';
    }

    const allUp = health.postgres === 'up' && (redis ? health.redis === 'up' : true);
    res.status(allUp ? 200 : 503).json(health);
});

export default router;