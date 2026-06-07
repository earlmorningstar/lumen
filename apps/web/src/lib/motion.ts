import { Variants, Transition } from 'framer-motion';

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const hoverScale = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 },
};

export const transition: Record<string, Transition> = {
    fast: { duration: 0.15, ease: 'easeOut' },
    normal: { duration: 0.2, ease: 'easeInOut' },
    springModal: { type: 'spring', stiffness: 300, damping: 30 },
};

// Respect prefers-reduced-motion (handled by framer-motion's global settings later)