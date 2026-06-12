import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Without using migration file, I'm ensuring schema_migrations table exists
        await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        for (const file of files) {
            const { rows } = await client.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [file]);
            if (rows.length > 0) {
                console.log(`⏭️  Skipping ${file} (already applied)`);
                continue;
            }
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
            await client.query(sql);
            await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
            console.log(`✅ Applied ${file}`);
        }

        await client.query('COMMIT');
        console.log('All migrations applied successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

migrate().catch((err) => {
    console.error(err);
    process.exit(1);
});