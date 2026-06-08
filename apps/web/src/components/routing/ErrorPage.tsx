import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slideInFromBottom } from '@/lib/motion';
import { ROUTES } from '@/router/routes';
import { Link } from 'react-router-dom';

export function ErrorPage() {
    const error = useRouteError();
    let status = 500;
    let title = 'Something went wrong';
    let message = 'An unexpected error occurred.';

    if (isRouteErrorResponse(error)) {
        status = error.status;
        if (status === 404) {
            title = 'Page not found';
            message = "This page doesn't exist.";
        } else {
            message = error.statusText || error.data?.message || message;
        }
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                variants={slideInFromBottom}
                initial="hidden"
                animate="visible"
                className="glass max-w-md w-full p-8 text-center rounded-2xl"
            >
                <h1 className="font-display text-4xl text-accent mb-4">
                    {status === 404 ? '404' : 'Oops!'}
                </h1>
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-text-secondary mb-6">{message}</p>
                <div className="flex gap-3 justify-center">
                    {status !== 404 && (
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-surface-interactive rounded-lg hover:bg-surface-elevated transition-fast"
                        >
                            Retry
                        </button>
                    )}
                    <Link
                        to={ROUTES.HOME}
                        className="px-4 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent-hover transition-fast"
                    >
                        Go Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}