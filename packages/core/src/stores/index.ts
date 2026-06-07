import { create } from 'zustand';
import type { User, PlayerState } from '../types';

// ---- User Slice ----
interface UserSlice {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    logout: () => void;
}

const createUserSlice = (set: any): UserSlice => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setAccessToken: (token) => {
        // Expose token globally for axios interceptor
        (window as any).__LUMEN_ACCESS_TOKEN__ = token;
        set({ accessToken: token });
    },
    logout: () => {
        (window as any).__LUMEN_ACCESS_TOKEN__ = null;
        set({ user: null, accessToken: null, isAuthenticated: false });
    },
});

// ---- Player Slice ----
interface PlayerSlice {
    playerState: PlayerState | null;
    setPlayerState: (state: PlayerState) => void;
    clearPlayer: () => void;
}

const initialPlayerState: PlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    buffered: null,
    volume: 1,
    muted: false,
    playbackRate: 1,
    qualityLevel: -1, // auto
    isFullscreen: false,
    isMiniPlayer: false,
};

const createPlayerSlice = (set: any): PlayerSlice => ({
    playerState: null,
    setPlayerState: (state) => set({ playerState: state }),
    clearPlayer: () => set({ playerState: null }),
});

// ---- UI Slice ----
interface UISlice {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

const createUISlice = (set: any): UISlice => ({
    sidebarOpen: false,
    toggleSidebar: () => set((state: UISlice) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
});

// ---- Combined Store ----
export const useStore = create<UserSlice & PlayerSlice & UISlice>()((...a) => ({
    ...createUserSlice(a[0]),
    ...createPlayerSlice(a[0]),
    ...createUISlice(a[0]),
}));