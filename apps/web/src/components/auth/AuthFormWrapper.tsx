import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInFromBottom } from '@/lib/motion';

interface AuthFormWrapperProps {
    activeTab: 'login' | 'register';
    onTabChange: (tab: 'login' | 'register') => void;
    children: ReactNode;
}

const tabs = [
    { id: 'login', label: 'Sign in' },
    { id: 'register', label: 'Create account' },
];

export function AuthFormWrapper({ activeTab, onTabChange, children }: AuthFormWrapperProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* Logo */}
            <div className="text-center mb-8">
                <h1 className="font-display text-4xl text-accent tracking-display">LUMEN</h1>
                <p className="text-text-muted italic mt-2">Cinema without limits.</p>
            </div>

            {/* Glass panel */}
            <div className="glass-strong p-6 rounded-2xl">
                {/* Tab bar – no Framer Motion layoutId to avoid loops */}
                <div className="flex border-b border-border-default mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as 'login' | 'register')}
                            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={slideInFromBottom}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>

            <p className="text-xs text-text-muted text-center mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    );
}