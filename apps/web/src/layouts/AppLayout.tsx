import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { useEffect, useRef, useState } from 'react';

export default function AppLayout() {
    useScrollRestoration();
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background-page">
            <Navbar ref={navRef} scrolled={scrolled} />
            <main
                className="flex-1"
                style={{ paddingTop: 'var(--navbar-height, 64px)' }}
            >
                <Outlet />
            </main>
            <MobileNav />
        </div>
    );
}