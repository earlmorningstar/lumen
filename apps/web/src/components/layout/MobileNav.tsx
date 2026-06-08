import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/router/routes';

const items = [
    { path: ROUTES.HOME, label: 'Home', icon: HomeIcon },
    { path: ROUTES.SEARCH, label: 'Search', icon: SearchIcon },
    { path: ROUTES.WATCHLIST, label: 'My List', icon: ListIcon },
    { path: ROUTES.PROFILE, label: 'Profile', icon: ProfileIcon },
];

function HomeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function ListIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
    );
}

function ProfileIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

export default function MobileNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border-subtle">
            <div className="flex items-center justify-around h-16 px-2">
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className="flex flex-col items-center gap-1 text-xs font-medium relative"
                    >
                        {({ isActive }) => (
                            <>
                                <span className={isActive ? 'text-accent' : 'text-text-muted'}>
                                    <item.icon />
                                </span>
                                <span className={isActive ? 'text-accent' : 'text-text-muted'}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        className="absolute -top-1 h-0.5 w-8 bg-accent rounded-full"
                                        layoutId="mobile-nav-indicator"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}