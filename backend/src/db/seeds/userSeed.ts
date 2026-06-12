import { PoolClient } from 'pg';
import { hashPassword } from '../../utils/password';

const users = [
    { email: 'admin@lumen.dev', password: 'Admin123!', displayName: 'Admin User' },
    { email: 'user@lumen.dev', password: 'User123!', displayName: 'Test User' },
    { email: 'demo@lumen.dev', password: 'Demo123!', displayName: 'Demo Account' },
];

export async function seedUsers(client: PoolClient) {
    for (const u of users) {
        const hash = await hashPassword(u.password);
        await client.query(
            `INSERT INTO users (email, password_hash, display_name) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
            [u.email, hash, u.displayName]
        );
    }
    console.log('Test users created.');
}