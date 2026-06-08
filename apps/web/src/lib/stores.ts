import { createAuthStore, createUIStore } from '@lumen/core';
import { apiClient } from '@/lib/axios';

export const useAuthStore = createAuthStore(apiClient);
export const useUIStore = createUIStore();