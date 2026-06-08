import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-page p-4">
            <motion.div
                className="w-full max-w-md"
                variants={pageTransition}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <Outlet />
            </motion.div>
        </div>
    );
}