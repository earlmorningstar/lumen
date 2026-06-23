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

export async function findGenresWithCounts() {
    const genres = await query<{ genre: string; count: string }>(
        `SELECT unnest(genre) AS genre, COUNT(*) AS count
     FROM content
     GROUP BY genre
     ORDER BY count DESC`
    );

    // For each genre, get the thumbnail of the first content item
    const result = await Promise.all(
        genres.map(async (g) => {
            const content = await query<Content>(
                'SELECT thumbnail_url FROM content WHERE $1 = ANY(genre) LIMIT 1',
                [g.genre]
            );
            return {
                genre: g.genre,
                count: parseInt(g.count, 10),
                thumbnailUrl: content[0]?.thumbnail_url || '',
            };
        })
    );

    return result;
}

export async function searchByQuery(q: string, limit: number, offset: number) {
    const countResult = await query<{ count: string }>(
        `SELECT COUNT(*) FROM content
     WHERE title ILIKE $1 OR description ILIKE $1 OR tags && ARRAY[$2]`,
        [`%${q}%`, q]
    );
    const total = parseInt(countResult[0].count, 10);

    const data = await query<Content>(
        `SELECT * FROM content
     WHERE title ILIKE $1 OR description ILIKE $1 OR tags && ARRAY[$2]
     ORDER BY
       CASE WHEN title ILIKE $1 THEN 0 ELSE 1 END,
       release_year DESC
     LIMIT $3 OFFSET $4`,
        [`%${q}%`, q, limit, offset]
    );

    return { data, total };
}

export async function findByGenre(genre: string, limit: number, offset: number) {
    const countResult = await query<{ count: string }>(
        'SELECT COUNT(*) FROM content WHERE genre @> ARRAY[$1]',
        [genre]
    );
    const total = parseInt(countResult[0].count, 10);

    const data = await query<Content>(
        'SELECT * FROM content WHERE genre @> ARRAY[$1] ORDER BY release_year DESC LIMIT $2 OFFSET $3',
        [genre, limit, offset]
    );

    return { data, total };
}

export async function findRelated(id: string, limit = 8) {
    // Get the content's genres first
    const content = await query<Content>('SELECT genre FROM content WHERE id = $1', [id]);
    if (!content.length) return [];

    const genres = content[0].genre;
    const related = await query<Content>(
        `SELECT c.* FROM content c
     LEFT JOIN analytics_content_metrics m ON c.id = m.content_id
     WHERE c.id != $1 AND c.genre && $2::text[]
     ORDER BY m.total_views DESC NULLS LAST
     LIMIT $3`,
        [id, genres, limit]
    );

    return related;
}

export async function incrementViewCount(contentId: string) {
    await query(
        `INSERT INTO analytics_content_metrics (content_id, total_views, total_watch_sec, completion_rate, avg_watch_pct)
     VALUES ($1, 1, 0, 0, 0)
     ON CONFLICT (content_id)
     DO UPDATE SET total_views = analytics_content_metrics.total_views + 1,
                   updated_at = NOW()`,
        [contentId]
    );
}