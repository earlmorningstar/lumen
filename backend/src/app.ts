import express, { type Express } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsConfig } from './config/cors';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { testConnection } from './config/database';
import { testRedisConnection } from './config/redis';
import contentRouter from './modules/content/content.router';
import authRouter from './modules/auth/auth.router';

const app: Express = express();

app.use(helmet());
app.use(corsConfig);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/api/', apiLimiter);

app.get('/health', async (_req, res) => {
    const dbUp = await testConnection();
    const redisUp = await testRedisConnection();
    res.json({
        status: dbUp && redisUp ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
            database: dbUp ? 'connected' : 'error',
            redis: redisUp ? 'connected' : 'error',
        },
        version: process.env.npm_package_version || '1.0.0',
    });
});

app.use('/api/v1/content', contentRouter);
// Stubs for future modules
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', (_req, res) => res.status(501).json({ error: 'Not implemented' }));
app.use('/api/v1/analytics', (_req, res) => res.status(501).json({ error: 'Not implemented' }));
app.use('/api/v1/recommendations', (_req, res) => res.status(501).json({ error: 'Not implemented' }));

app.use(notFound);
app.use(errorHandler);

export default app;