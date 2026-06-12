import type { Variants, Transition } from 'framer-motion';

// Utility: Check for reduced motion 
export function shouldReduceMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Transition presets 
export const transitions = {
    page: { duration: 0.2, ease: 'easeInOut' } as Transition,
    cardHover: { duration: 0.15, ease: 'easeOut' } as Transition,
    cardExit: { duration: 0.12, ease: 'easeIn' } as Transition,
    springModal: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
    glassReveal: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } as Transition,
};

// Variants
// Helper: creates a reduced-motion variant that only fades
const onlyFade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const pageTransition: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
    };

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const cardHover: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        rest: { scale: 1, y: 0 },
        hover: { scale: 1.05, y: -4 },
        tap: { scale: 0.98 },
    };

export const heroParallax: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        initial: { y: 0 },
        scroll: (offset: number) => ({ y: offset }),
    };

export const skeletonPulse: Variants = {
    hidden: { opacity: 0.5 },
    visible: {
        opacity: [0.5, 1, 0.5],
        transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
};

export const modalOverlay: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const modalContent: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: transitions.springModal,
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    };

export const slideInFromBottom: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

export const slideInFromRight: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
    };

export const staggerChildren: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

export const contentRowReveal: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
    };

export const glassReveal: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        hidden: { opacity: 0, scale: 0.98, backdropFilter: 'blur(0px)' },
        visible: {
            opacity: 1,
            scale: 1,
            backdropFilter: 'blur(var(--glass-blur-md, 20px))',
            transition: transitions.glassReveal,
        },
    };

export const playerControlsShow: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

export const playerControlsHide: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
    };

export const miniPlayerEntry: Variants = shouldReduceMotion()
    ? onlyFade
    : {
        hidden: { opacity: 0, x: 30, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 400, damping: 25 },
        },
    };