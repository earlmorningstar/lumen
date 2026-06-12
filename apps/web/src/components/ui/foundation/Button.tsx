import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    children?: ReactNode;
    disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-black hover:bg-accent-hover active:bg-accent',
    secondary:
        'bg-background-surface text-text-primary border border-border-default hover:bg-background-elevated',
    ghost: 'text-text-primary hover:bg-background-surface',
    danger: 'bg-status-error text-white hover:opacity-90',
    glass: 'glass text-text-primary hover:bg-glass-medium',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-base gap-2',
    lg: 'h-12 px-6 text-lg gap-2.5',
    icon: 'h-10 w-10 p-0 justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            disabled,
            children,
            className = '',
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <motion.button
                ref={ref}
                disabled={isDisabled}
                whileTap={isDisabled ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className={`
          inline-flex items-center justify-center font-medium
          rounded-lg select-none outline-none
          focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-page
          transition-colors duration-150
          disabled:opacity-50 disabled:pointer-events-none
          ${fullWidth ? 'w-full' : ''}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${isLoading ? 'cursor-wait' : ''}
          ${className}
        `}
                {...props}
            >
                {isLoading ? (
                    <Spinner
                        size={size === 'lg' ? 'md' : 'sm'}
                        variant={variant === 'primary' ? 'white' : 'default'}
                    />
                ) : (
                    <>
                        {leftIcon}
                        {children}
                        {rightIcon}
                    </>
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';