import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type CardVariant = 'default' | 'elevated' | 'glass' | 'interactive';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

// Base props that both div and button variants share
interface BaseCardProps {
    variant?: CardVariant;
    padding?: CardPadding;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

const variantClasses: Record<CardVariant, string> = {
    default: 'bg-background-card border border-border-default',
    elevated: 'bg-background-elevated border border-border-default',
    glass: 'glass',
    interactive:
        'bg-background-card border border-border-default hover:scale-[1.01] hover:border-border-strong cursor-pointer transition-all duration-150',
};

const paddingClasses: Record<CardPadding, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
};

export function Card({
    variant = 'default',
    padding = 'md',
    children,
    onClick,
    className = '',
    ...rest
}: BaseCardProps & Omit<HTMLMotionProps<'div'>, 'children'>) {
    const classes = `rounded-xl overflow-hidden ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;

    if (variant === 'interactive') {
        //motion.button for interactive cards
        const buttonProps = rest as Omit<HTMLMotionProps<'button'>, 'children'>;
        return (
            <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={onClick}
                className={classes}
                {...buttonProps}
            >
                {children}
            </motion.button>
        );
    }

    return (
        <motion.div className={classes} {...rest}>
            {children}
        </motion.div>
    );
}