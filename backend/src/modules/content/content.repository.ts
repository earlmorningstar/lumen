import { query } from '../../config/database';
import type { Content, Episode } from '../../types';

export async function findMany(params: any) {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (params.type) {
        conditions.push(`type = $${idx++}`);
        values.push(params.type);
    }
    if (params.genre) {
        conditions.push(`$${idx++} = ANY(genre)`);
        values.push(params.genre);
    }
    if (params.search) {
        conditions.push(`(title ILIKE $${idx++} OR description ILIKE $${idx++})`);
        values.push(`%${params.search}%`, `%${params.search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy = params.sort === 'trending'
        ? 'ORDER BY (SELECT total_views FROM analytics_content_metrics WHERE content_id = content.id) DESC NULLS LAST'
        : params.sort === 'rating' ? 'ORDER BY rating DESC'
            : 'ORDER BY release_year DESC, created_at DESC';

    const countResult = await query<{ count: string }>(`SELECT COUNT(*) FROM content ${where}`, values);
    const total = parseInt(countResult[0].count, 10);

    const data = await query<Content>(
        `SELECT * FROM content ${where} ${orderBy} LIMIT $${idx++} OFFSET $${idx++}`,
        [...values, params.limit, (params.page - 1) * params.limit]
    );

    return { data, total };
}

export async function findFeatured() {
    return query<Content>('SELECT * FROM content WHERE is_featured = true ORDER BY release_year DESC LIMIT 10');
}

export async function findById(id: string) {
    const rows = await query<Content>('SELECT * FROM content WHERE id = $1', [id]);
    return rows[0] || null;
}

export async function findEpisodesByContentId(contentId: string) {
    return query<Episode>('SELECT * FROM episodes WHERE content_id = $1 ORDER BY season, episode', [contentId]);
}

export async function findTrending(limit = 20) {
    return query<Content>(
        `SELECT c.* FROM content c
     LEFT JOIN analytics_content_metrics m ON c.id = m.content_id
     ORDER BY m.total_views DESC NULLS LAST
     LIMIT $1`, [limit]
    );
}