import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores'
import { ROUTES } from '@/router/routes';
import { glassReveal } from '@/lib/motion';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export default function NavbarUserMenu() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useOnClickOutside(menuRef, () => setIsOpen(false));

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        navigate(ROUTES.AUTH.LOGIN);
    };

    if (!isAuthenticated) {
        return (
            <Link
                to={ROUTES.AUTH.LOGIN}
                className="px-4 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent-hover transition-fast text-sm"
            >
                Sign In
            </Link>
        );
    }

    const initials = user?.displayName
        ? user.displayName
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
        : '?';

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-glass-medium transition-fast"
            >
                {user?.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-accent-muted flex items-center justify-center text-sm font-semibold text-accent">
                        {initials}
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={glassReveal}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute right-0 top-full mt-2 w-56 p-2 glass-strong rounded-xl z-50"
                    >
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium">{user?.displayName}</p>
                            <p className="text-xs text-text-muted">{user?.email}</p>
                        </div>
                        <div className="h-px bg-border-default my-1" />
                        <Link
                            to={ROUTES.WATCHLIST}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm rounded-lg hover:bg-glass-medium transition-fast"
                        >
                            My List
                        </Link>
                        <Link
                            to={ROUTES.PROFILE}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm rounded-lg hover:bg-glass-medium transition-fast"
                        >
                            Profile
                        </Link>
                        <div className="h-px bg-border-default my-1" />
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-glass-medium transition-fast text-text-secondary hover:text-white"
                        >
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}