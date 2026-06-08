import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function AuthPage() {
    return (
        <motion.div
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass p-8 rounded-2xl text-center"
        >
            <h2 className="font-display text-2xl text-accent mb-4">Sign In</h2>
            <p className="text-text-secondary">Authentication form coming phase 7</p>
        </motion.div>
    );
}