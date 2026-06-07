import { createApiClient } from '@lumen/core';
import { env } from '@/env';

export const apiClient = createApiClient(env.API_BASE_URL);