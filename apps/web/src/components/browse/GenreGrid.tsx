import { motion } from 'framer-motion';

interface GenreCard {
    genre: string;
    count: number;
    thumbnailUrl: string;
}

interface GenreGridProps {
    genres: GenreCard[];
    onSelect: (genre: string) => void;
}

export function GenreGrid({ genres, onSelect }: GenreGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {genres.map((g) => (
                <motion.button
                    key={g.genre}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => onSelect(g.genre)}
                    className="relative group rounded-xl overflow-hidden aspect-4/3 bg-background-card"
                >
                    <img
                        src={g.thumbnailUrl}
                        alt={g.genre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-display text-lg capitalize text-white">{g.genre}</h3>
                        <p className="text-xs text-text-secondary">{g.count} titles</p>
                    </div>
                </motion.button>
            ))}
        </div>
    );
}