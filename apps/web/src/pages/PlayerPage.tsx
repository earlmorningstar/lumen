import { useParams } from 'react-router-dom';

export default function PlayerPage() {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black">
            <p className="text-text-secondary">Player for content {id} (coming soon)</p>
        </div>
    );
}