import { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    motion,
    // AnimatePresence
} from 'framer-motion';
import { ROUTES } from '@/router/routes';
import NavbarSearch from './NavbarSearch';
import NavbarUserMenu from './NavbarUserMenu';
// import { fadeIn } from '@/lib/motion';

interface NavbarProps {
    scrolled: boolean;
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(({ scrolled }, ref) => {
    const location = useLocation();

    const navLinks = [
        { label: 'Home', path: ROUTES.HOME },
        { label: 'Movies', path: '/movies' },    // to be updated later
        { label: 'Series', path: '/series' },
        { label: 'Trending', path: '/trending' },
    ];

    return (
        <nav
            ref={ref}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 glass-navbar ${scrolled ? 'bg-opacity-90' : 'bg-opacity-70'
                }`}
            style={{ height: 'var(--navbar-height, 64px)' }}
        >
            <div className="h-full flex items-center justify-between px-4 lg:px-8 max-w-screen-2xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-8">
                    <Link
                        to={ROUTES.HOME}
                        className="font-display text-2xl text-accent tracking-display select-none"
                    >
                        LUMEN
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-6 relative">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors duration-150 ${isActive
                                        ? 'text-white'
                                        : 'text-text-secondary hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            className="h-0.5 bg-accent rounded-full mt-0.5"
                                            layoutId="nav-indicator"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                    <NavbarSearch />
                    <NavbarUserMenu />
                </div>
            </div>
        </nav>
    );
});

Navbar.displayName = 'Navbar';

export default Navbar;