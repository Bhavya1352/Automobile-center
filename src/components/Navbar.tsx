import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * Navbar — a company navigation bar, not a floating control panel.
 *
 * Fixed to the top on the page ground, closed by a hairline rule. Below
 * `lg` the links collapse into a full-height panel that locks the body
 * scroll behind it.
 */

interface NavItem {
    label: string;
    /** Homepage section id, for in-page navigation. */
    hash?: string;
    /** Or a real route. */
    to?: string;
}

const NAV: NavItem[] = [
    { label: 'Services', hash: 'services' },
    { label: 'How it works', hash: 'how-it-works' },
    { label: 'AI vehicle check', hash: 'ai-check' },
    { label: 'Pricing', hash: 'pricing' },
];

const Navbar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const toggleRef = useRef<HTMLButtonElement>(null);

    // Escape closes the panel and returns focus to the toggle.
    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileOpen(false);
                toggleRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [mobileOpen]);

    // Prevent the page scrolling behind the open mobile panel.
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const goToSection = useCallback((hash: string) => {
        setMobileOpen(false);
        const scrollTo = (el: HTMLElement) => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const top = el.getBoundingClientRect().top + window.scrollY - 76;
            window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
        };

        if (location.pathname === '/') {
            const el = document.getElementById(hash);
            if (el) scrollTo(el);
            return;
        }

        navigate('/');
        // The homepage is a lazy route, and ScrollToTop resets the scroll
        // as soon as the path changes. A fixed delay lost both races: it
        // fired before the section existed, and what it did scroll was
        // undone by that reset. Waiting for the target to appear puts the
        // scroll after both, since the section only exists once the
        // homepage has mounted.
        let frames = 0;
        const findAndScroll = () => {
            const el = document.getElementById(hash);
            if (el) { scrollTo(el); return; }
            // ~2s at 60fps, then give up rather than scroll blind.
            if (++frames < 120) requestAnimationFrame(findAndScroll);
        };
        requestAnimationFrame(findAndScroll);
    }, [location.pathname, navigate]);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper">
            <div className="wrap">
                <div className="flex h-[72px] items-center justify-between gap-6">

                    {/* Wordmark */}
                    <Link
                        to="/"
                        className="flex shrink-0 items-baseline gap-[3px] font-display text-[1.625rem] font-normal leading-none tracking-[-0.01em] text-ink"
                    >
                        AutoSphere
                        <span className="text-clay-ink" aria-hidden="true">.</span>
                        <span className="sr-only">Home</span>
                    </Link>

                    {/* Desktop navigation */}
                    <nav aria-label="Main" className="hidden lg:block">
                        <ul className="flex items-center gap-9">
                            {NAV.map(item => (
                                <li key={item.label}>
                                    {item.hash ? (
                                        <button
                                            type="button"
                                            onClick={() => goToSection(item.hash!)}
                                            className="text-[0.9375rem] font-medium text-ink-soft transition-colors hover:text-ink"
                                        >
                                            {item.label}
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.to!}
                                            className="text-[0.9375rem] font-medium text-ink-soft transition-colors hover:text-ink"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden shrink-0 items-center gap-6 lg:flex">
                        <Link
                            to="/get-started"
                            className="text-[0.9375rem] font-medium text-ink-soft transition-colors hover:text-ink"
                        >
                            Log in
                        </Link>
                        <Link to="/contact" className="btn btn-solid px-5 py-[0.6875rem] text-[0.875rem]">
                            Book a service
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        ref={toggleRef}
                        type="button"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        className="-mr-2 flex h-10 w-10 items-center justify-center text-ink lg:hidden"
                    >
                        {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
                    </button>
                </div>
            </div>

            {/* Mobile panel */}
            {mobileOpen && (
                <div
                    id="mobile-nav"
                    className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto border-t border-line bg-paper lg:hidden"
                >
                    <nav aria-label="Main" className="wrap py-2">
                        <ul>
                            {NAV.map(item => (
                                <li key={item.label} className="border-b border-line-soft">
                                    <button
                                        type="button"
                                        onClick={() => goToSection(item.hash!)}
                                        className="w-full py-5 text-left text-[1.25rem] font-semibold tracking-[-0.014em] text-ink"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-col gap-3 pb-10">
                            <Link
                                to="/contact"
                                onClick={() => setMobileOpen(false)}
                                className="btn btn-solid w-full"
                            >
                                Book a service
                            </Link>
                            <Link
                                to="/get-started"
                                onClick={() => setMobileOpen(false)}
                                className="btn btn-outline w-full"
                            >
                                Log in
                            </Link>
                        </div>

                        <div className="border-t border-line-soft pb-12 pt-6">
                            <p className="spec-label">Service centre</p>
                            <a
                                onClick={() => setMobileOpen(false)}
                                href="tel:+912244881200"
                                className="stat mt-1 block text-[1.375rem]"
                            >
                                +91 22 4488 1200
                            </a>
                            <p className="mt-1 text-sm text-muted">Mon–Sat, 8:30–19:00</p>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
