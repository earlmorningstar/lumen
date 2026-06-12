import { useState, useCallback, type KeyboardEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';

type TabVariant = 'default' | 'glass' | 'pills';

interface TabItem {
    id: string;
    label: string;
    icon?: ReactNode;
    count?: number;
}

interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: TabVariant;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default', className = '' }: TabsProps) {
    const [tabRefs, setTabRefs] = useState<(HTMLButtonElement | null)[]>([]);

    const setTabRef = useCallback((index: number) => (el: HTMLButtonElement | null) => {
        setTabRefs((prev) => {
            const next = [...prev];
            next[index] = el;
            return next;
        });
    }, []);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
        let newIndex: number | null = null;
        if (event.key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }
        if (newIndex !== null) {
            event.preventDefault();
            onChange(tabs[newIndex].id);
            tabRefs[newIndex]?.focus();
        }
    };

    const containerClasses = {
        default: 'flex border-b border-border-default',
        glass: 'glass flex p-1 gap-1 rounded-xl',
        pills: 'bg-background-surface flex p-1 gap-1 rounded-xl',
    }[variant];

    return (
        <div role="tablist" className={`${containerClasses} ${className}`} onKeyDown={handleKeyDown}>
            {tabs.map((tab, index) => {
                const isActive = tab.id === activeTab;
                const baseClass =
                    variant === 'default'
                        ? 'relative px-4 py-2.5 text-sm font-medium transition-colors'
                        : 'relative flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors';

                return (
                    <button
                        key={tab.id}
                        ref={setTabRef(index)}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`panel-${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onChange(tab.id)}
                        className={`
              ${baseClass}
              ${isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}
              ${variant === 'pills' && isActive ? 'bg-accent text-black' : ''}
              ${variant === 'glass' && isActive ? 'bg-glass-medium' : ''}
            `}
                    >
                        {tab.icon && <span className="mr-2 inline-flex">{tab.icon}</span>}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className="ml-1.5 text-xs text-text-muted">({tab.count})</span>
                        )}
                        {variant === 'default' && isActive && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                layoutId="tab-indicator"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}