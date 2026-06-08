import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slideInFromBottom } from '@/lib/motion';
import { ROUTES } from '@/router/routes';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <motion.div
                variants={slideInFromBottom}
                initial="hidden"
                animate="visible"
                className="text-center"
            >
                <h1 className="font-display text-9xl text-accent mb-6">404</h1>
                <p className="text-xl text-text-secondary mb-8">This page doesn't exist.</p>
                <Link
                    to={ROUTES.HOME}
                    className="inline-block px-8 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent-hover transition-fast"
                >
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}