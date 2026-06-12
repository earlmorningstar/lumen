import { useFeaturedContent, useTrendingContent, type Content } from '@lumen/core';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAuthStore } from '@/lib/stores';
import { useLogin } from '@/hooks/useAuth';

export default function DevTestPage() {
    const { data: featured, isLoading } = useFeaturedContent();
    const { data: trending } = useTrendingContent();
    const { user, logout } = useAuthStore();
    const loginMutation = useLogin();
    const { watchlist, toggleWatchlist } = useWatchlist();

    const handleLogin = () => {
        loginMutation.mutate({ email: 'user@lumen.dev', password: 'User123!' });
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Dev Test</h1>
            <div className="mt-4">
                Auth: {user ? `Logged in as ${user.displayName}` : 'Not logged in'}
                <button className="ml-4 p-2 bg-accent" onClick={user ? logout : handleLogin}>
                    {user ? 'Logout' : 'Login (test user)'}
                </button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl">Featured Content</h2>
                    {isLoading ? <p>Loading...</p> : featured?.map((c: Content) => <div key={c.id}>{c.title}</div>)}
                </div>
                <div>
                    <h2 className="text-xl">Trending</h2>
                    {trending?.map((c: Content) => <div key={c.id}>{c.title}</div>)}
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl">Watchlist Toggle</h2>
                <button
                    className="p-2 bg-glass"
                    onClick={() => toggleWatchlist.mutate(featured?.[0]?.id || '')}
                >
                    Toggle first featured
                </button>
                <pre>{JSON.stringify(watchlist, null, 2)}</pre>
            </div>
        </div>
    );
}