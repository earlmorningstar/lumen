import cors from 'cors';
import { env } from './env';

export const corsConfig = cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
});