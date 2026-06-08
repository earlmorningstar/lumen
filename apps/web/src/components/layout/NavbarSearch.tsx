import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildSearchRoute } from '@/router/routes';
import { glassReveal } from '@/lib/motion';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export default function NavbarSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useOnClickOutside(containerRef, () => setIsOpen(false));

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(buildSearchRoute(query.trim()));
            setIsOpen(false);
            setQuery('');
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-glass-medium transition-fast"
                aria-label="Search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.form
                        variants={glassReveal}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onSubmit={handleSubmit}
                        className="absolute right-0 top-full mt-2 w-72 p-3 glass-strong rounded-xl z-50"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search titles, genres..."
                            className="w-full bg-transparent border-none outline-none text-sm text-text-primary placeholder-text-muted"
                        />
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}