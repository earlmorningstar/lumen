import { pool } from '../../config/database';
import { seedContent } from './contentSeed';
import { seedUsers } from './userSeed';

async function seed() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Seeding content...');
        await seedContent(client);
        console.log('Seeding users...');
        await seedUsers(client);
        await client.query('COMMIT');
        console.log('Seed completed successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Seed failed:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});