import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
    const val = process.env[name];
    if (!val) throw new Error(`Missing required environment variable: ${name}`);
    return val;
}

export const env = {
    PORT: parseInt(process.env.PORT || '4000', 10),
    DATABASE_URL: requireEnv('DATABASE_URL'),
    REDIS_URL: requireEnv('REDIS_URL'),
    JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
} as const;