import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Menu, X, ChevronDown, User, ShieldCheck, Car, LayoutDashboard, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
    name: string;
    path: string;
    icon?: React.ElementType;
}

interface NavLink {
    name: string;
    type: 'link' | 'dropdown';
    path?: string;
    items?: NavItem[];
}

const Navbar: React.FC = () => {
    const { direction, toggleDirection } = useLanguage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const navRef = useRef<HTMLElement>(null);

    // ── Close dropdown when clicking outside ──
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Auto-close on route change ──
    useEffect(() => {
        setActiveDropdown(null);
        setMobileOpen(false);
        setMobileExpanded(null);
    }, [location.pathname]);

    const isActive = (path: string) =>
        path === '/home1'
            ? location.pathname === '/' || location.pathname === '/home1'
            : location.pathname === path;

    const isDropdownActive = (items?: NavItem[]) =>
        items?.some(item => isActive(item.path)) ?? false;

    const navLinks: NavLink[] = [
        {
            name: 'Home',
            type: 'dropdown',
            items: [
                { name: 'Home 1 — Tech Hub', path: '/home1', icon: Zap },
                { name: 'Home 2 — Heritage', path: '/home2', icon: LayoutDashboard },
            ],
        },
        { name: 'Solutions', type: 'link', path: '/solutions' },
        { name: 'Pricing', type: 'link', path: '/pricing' },
        { name: 'About', type: 'link', path: '/about' },
        {
            name: 'Dashboard',
            type: 'dropdown',
            items: [
                { name: 'User Dashboard', path: '/user-dashboard', icon: User },
                { name: 'Admin Dashboard', path: '/admin-dashboard', icon: ShieldCheck },
            ],
        },
    ];

    const handleNav = (path: string) => {
        navigate(path);
        setActiveDropdown(null);
        setMobileOpen(false);
    };

    return (
        <nav
            ref={navRef}
            style={{
                zIndex: 9999,
                position: 'fixed',
                top: '1rem',
                left: '1.5rem',
                right: '1.5rem',
                background: 'rgba(10,10,15,0.75)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '1rem',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05), 0 8px 40px -8px rgba(0,0,0,0.5)',
                /* NO overflow:hidden — this is the key that was clipping the dropdown */
            }}
        >
            <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">

                {/* ── Brand ─────────────────────────────────────────── */}
                <button
                    onClick={() => handleNav('/')}
                    className="flex items-center gap-2 flex-shrink-0 group"
                >
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
                        <Car size={20} className="text-secondary" />
                    </div>
                    <span className="text-2xl font-outfit font-bold text-white group-hover:text-primary transition-colors">
                        Auto<span className="text-primary">Sphere</span>
                    </span>
                </button>

                {/* ── Desktop Links ─────────────────────────────────── */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <div key={link.name} className="relative">

                            {link.type === 'link' ? (
                                <button
                                    onClick={() => handleNav(link.path!)}
                                    className={`py-2 px-1 font-medium text-sm transition-colors ${link.path && isActive(link.path)
                                        ? 'text-primary font-semibold'
                                        : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ) : (
                                /* ── Dropdown trigger ── */
                                <button
                                    onClick={() =>
                                        setActiveDropdown(prev =>
                                            prev === link.name ? null : link.name
                                        )
                                    }
                                    className={`flex items-center gap-1 py-2 px-1 font-medium text-sm transition-colors select-none ${isDropdownActive(link.items) || activeDropdown === link.name
                                        ? 'text-primary font-semibold'
                                        : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                            )}

                            {/* ── Dropdown panel ── */}
                            {link.type === 'dropdown' && (
                                <AnimatePresence>
                                    {activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                            transition={{ duration: 0.15, ease: 'easeOut' }}
                                            style={{ zIndex: 10000 }}
                                            className="absolute top-full mt-3 left-0 w-64 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                                            // prevent click-outside from firing on the panel itself
                                            onMouseDown={e => e.stopPropagation()}
                                        >
                                            {/* Frosted glass background */}
                                            <div className="bg-[#0d0d0d]/95 backdrop-blur-2xl p-2">
                                                {/* Triangle notch */}
                                                <div className="absolute -top-2 left-6 w-4 h-4 bg-[#0d0d0d]/95 border-l border-t border-white/10 rotate-45 rounded-sm" />

                                                {link.items?.map((item) => {
                                                    const active = isActive(item.path);
                                                    return (
                                                        <button
                                                            key={item.name}
                                                            onClick={() => handleNav(item.path)}
                                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 group/item ${active
                                                                ? 'bg-primary/15 text-primary'
                                                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                                }`}
                                                        >
                                                            {item.icon && (
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${active
                                                                    ? 'bg-primary/20'
                                                                    : 'bg-white/5 group-hover/item:bg-primary/10'
                                                                    }`}>
                                                                    <item.icon
                                                                        size={16}
                                                                        className={active ? 'text-primary' : 'text-white/40 group-hover/item:text-primary transition-colors'}
                                                                    />
                                                                </div>
                                                            )}
                                                            <span className="text-sm font-medium flex-1 text-left">{item.name}</span>
                                                            {active && (
                                                                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Desktop Actions ───────────────────────────────── */}
                <div className="hidden lg:flex items-center gap-4">
                    <button
                        onClick={toggleDirection}
                        className="p-2 text-white/50 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                        title={direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
                    >
                        <Globe size={18} />
                    </button>
                    <button
                        onClick={() => handleNav('/get-started')}
                        className="btn-primary py-2 px-6 text-sm"
                    >
                        Get Started
                    </button>
                </div>

                {/* ── Mobile Toggle ─────────────────────────────────── */}
                <div className="lg:hidden flex items-center gap-3">
                    <button onClick={toggleDirection} className="text-white/50 hover:text-primary transition-colors">
                        <Globe size={18} />
                    </button>
                    <button
                        onClick={() => setMobileOpen(v => !v)}
                        className="text-white hover:text-primary transition-colors"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ───────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="lg:hidden border-t border-white/5 overflow-hidden"
                    >
                        <div className="p-4 space-y-1">
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    {link.type === 'dropdown' ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setMobileExpanded(p =>
                                                        p === link.name ? null : link.name
                                                    )
                                                }
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isDropdownActive(link.items)
                                                    ? 'text-primary bg-primary/5'
                                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                <span className="uppercase tracking-wider text-xs font-bold">{link.name}</span>
                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform ${mobileExpanded === link.name ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {mobileExpanded === link.name && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden pl-3 mt-1 space-y-1"
                                                    >
                                                        {link.items?.map((item) => {
                                                            const active = isActive(item.path);
                                                            return (
                                                                <button
                                                                    key={item.name}
                                                                    onClick={() => handleNav(item.path)}
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${active
                                                                        ? 'bg-primary/15 text-primary'
                                                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                                        }`}
                                                                >
                                                                    {item.icon && <item.icon size={15} className={active ? 'text-primary' : 'text-primary/40'} />}
                                                                    <span>{item.name}</span>
                                                                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleNav(link.path!)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${link.path && isActive(link.path)
                                                ? 'bg-primary/15 text-primary'
                                                : 'text-white hover:bg-white/5 hover:text-primary'
                                                }`}
                                        >
                                            {link.name}
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div className="pt-3 border-t border-white/5">
                                <button
                                    onClick={() => handleNav('/get-started')}
                                    className="w-full btn-primary text-sm py-2.5"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
