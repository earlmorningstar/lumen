import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInFromBottom } from '@/lib/motion';
import { Spinner } from './Spinner';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    isLoading?: boolean;
    size?: InputSize;
}

const sizeClasses: Record<InputSize, string> = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            isLoading,
            size = 'md',
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const hasError = !!error;

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm text-text-secondary mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        disabled={disabled || isLoading}
                        className={`
              w-full bg-background-surface border rounded-lg
              text-text-primary placeholder-text-muted
              transition-colors duration-150
              focus:outline-none focus:border-accent
              disabled:opacity-50 disabled:pointer-events-none
              ${hasError ? 'border-status-error' : 'border-border-default'}
              ${leftIcon ? 'pl-9' : 'pl-3'}
              ${rightIcon ? 'pr-9' : 'pr-3'}
              ${sizeClasses[size]}
              ${className}
            `}
                        {...props}
                    />
                    {rightIcon && !isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {rightIcon}
                        </div>
                    )}
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Spinner size="sm" variant="muted" />
                        </div>
                    )}
                </div>
                <AnimatePresence>
                    {error && (
                        <motion.p
                            variants={slideInFromBottom}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="mt-1.5 text-sm text-status-error"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
                {hint && !error && (
                    <p className="mt-1.5 text-sm text-text-muted">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';