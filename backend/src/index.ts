import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './env';
import healthRouter from './routes/health';

const app: Express = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);

// Global error handler (will be expanded)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        statusCode: err.status || 500,
    });
});

app.listen(env.PORT, () => {
    console.log(`Backend running on port ${env.PORT}`);
});

export default app;