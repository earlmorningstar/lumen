import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function WatchlistPage() {
    return (
        <motion.div
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-screen flex items-center justify-center bg-black"
        >
            <h1 className="font-display text-3xl text-text-secondary">Watchlist — coming soon enough</h1>
        </motion.div>
    );
}