import morgan from 'morgan';
import { env } from '../config/env';

morgan.token('auth', (req) => {
    const auth = req.headers.authorization;
    if (auth) {
        return auth.substring(0, 15) + '...';
    }
    return '-';
});

export const requestLogger = morgan(
    env.NODE_ENV === 'development'
        ? ':method :url :status :response-time ms - :auth'
        : 'combined'
);