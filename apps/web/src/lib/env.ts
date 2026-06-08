function requireEnvVar(name: string): string {
    const value = import.meta.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    API_URL: requireEnvVar('VITE_API_URL'),
    CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
    APP_ENV: (import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production') || 'development',
} as const;