const genres = ['All', 'action', 'drama', 'sci-fi', 'comedy', 'thriller', 'horror', 'documentary'] as const;

interface GenreFilterProps {
    activeGenre: string | null;
    activeType: 'movie' | 'series' | null;
    onGenreChange: (genre: string | null) => void;
    onTypeChange: (type: 'movie' | 'series' | null) => void;
}

export function GenreFilter({ activeGenre, activeType, onGenreChange, onTypeChange }: GenreFilterProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Genre pills row */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {genres.map((genre) => {
                    const isActive = genre === 'All' ? !activeGenre : activeGenre === genre;
                    return (
                        <button
                            key={genre}
                            onClick={() => onGenreChange(genre === 'All' ? null : genre)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${isActive
                                ? 'bg-accent text-black'
                                : 'bg-surface-interactive text-text-secondary hover:bg-surface-elevated hover:text-white'
                                }`}
                        >
                            {genre === 'All' ? 'All' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </button>
                    );
                })}
            </div>

            {/* Type toggle */}
            <div className="flex items-center gap-2 border-l border-border-default pl-4">
                <span className="text-sm text-text-muted">Type:</span>
                {(['movie', 'series'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => onTypeChange(activeType === type ? null : type)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeType === type
                            ? 'bg-accent text-black'
                            : 'bg-surface-interactive text-text-secondary hover:bg-surface-elevated hover:text-white'
                            }`}
                    >
                        {type === 'movie' ? 'Movies' : 'Series'}
                    </button>
                ))}
            </div>
        </div>
    );
}