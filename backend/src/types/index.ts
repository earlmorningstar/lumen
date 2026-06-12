export interface User {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Content {
    id: string;
    title: string;
    description: string;
    type: 'movie' | 'series';
    genre: string[];
    tags: string[];
    release_year: number;
    duration_sec: number;
    rating: string;
    thumbnail_url: string;
    backdrop_url: string;
    hls_url: string | null;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface Episode {
    id: string;
    content_id: string;
    season: number;
    episode: number;
    title: string;
    duration_sec: number;
    hls_url: string;
    thumbnail_url: string;
}