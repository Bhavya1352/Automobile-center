import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Menu, X, ChevronDown, User, ShieldCheck, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
    name: string;
    path: string;
    icon?: any;
}

interface NavLink {
    name: string;
    type: 'link' | 'dropdown';
    path?: string;
    items?: NavItem[];
}

const Navbar: React.FC = () => {
    const { direction, toggleDirection } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const navLinks: NavLink[] = [
        {
            name: 'Home',
            type: 'dropdown',
            items: [
                { name: 'Home 1', path: '/home1' },
                { name: 'Home 2', path: '/home2' },
            ],
        },
        {
            name: 'About',
            type: 'link',
            path: '/about',
        },
        {
            name: 'Contact',
            type: 'link',
            path: '/contact',
        },
        {
            name: 'Dashboards',
            type: 'dropdown',
            items: [
                { name: 'User Dashboard', path: '/user-dashboard', icon: User },
                { name: 'Admin Dashboard', path: '/admin-dashboard', icon: ShieldCheck },
            ],
        },
    ];

    return (
        <nav className="fixed top-4 left-4 right-4 lg:left-8 lg:right-8 z-50 glass-card bg-secondary/40 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl transition-all duration-500">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                {/* Brand — click to go to Home1 */}
                <a
                    href="/home1"
                    className="flex items-center space-x-2 rtl:space-x-reverse flex-shrink-0 cursor-pointer group"
                    aria-label="Go to Home"
                >
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
                        <Car size={20} className="text-secondary" />
                    </div>
                    <span className="text-2xl font-outfit font-bold whitespace-nowrap text-white group-hover:text-primary transition-colors">
                        Auto<span className="text-primary">Sphere</span>
                    </span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown(link.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            {link.type === 'link' ? (
                                <a
                                    href={link.path}
                                    className="flex items-center text-white/80 hover:text-primary transition-colors py-8 font-medium"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <button className="flex items-center space-x-1 rtl:space-x-reverse text-white/80 hover:text-primary transition-colors py-8">
                                    <span>{link.name}</span>
                                    <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                                </button>
                            )}

                            {link.type === 'dropdown' && (
                                <AnimatePresence>
                                    {activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-20 left-0 rtl:left-auto rtl:right-0 w-64 glass-card p-2 !bg-secondary border-white/10"
                                        >
                                            {link.items?.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.path}
                                                    className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-xl hover:bg-primary/10 transition-colors group/item"
                                                >
                                                    {item.icon && <item.icon size={18} className="text-primary/60 group-hover/item:text-primary" />}
                                                    <span className="text-sm font-medium">{item.name}</span>
                                                </a>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
                    <button
                        onClick={toggleDirection}
                        className="p-2 text-white/60 hover:text-primary transition-colors rtl:rotate-0"
                        title={direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
                    >
                        <Globe size={20} />
                    </button>
                    <button onClick={() => window.location.href = '/get-started'} className="btn-primary flex items-center space-x-2 rtl:space-x-reverse py-2 px-6">
                        <span>Get Started</span>
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className="lg:hidden flex items-center space-x-4 rtl:space-x-reverse">
                    <button onClick={toggleDirection} className="text-white/60"><Globe size={20} /></button>
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden glass-card !rounded-none border-x-0 border-b-0 overflow-hidden !bg-secondary"
                    >
                        <div className="p-4 space-y-4">
                            {navLinks.map((link) => (
                                <div key={link.name} className="space-y-2">
                                    {link.type === 'dropdown' ? (
                                        <>
                                            <div className="text-white/60 text-xs font-bold uppercase tracking-wider px-2">{link.name}</div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {link.items?.map((item) => (
                                                    <a key={item.name} href={item.path} className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-xl hover:bg-primary/10">
                                                        {item.icon && <item.icon size={18} className="text-primary" />}
                                                        <span>{item.name}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <a href={link.path} className="block p-3 rounded-xl text-white hover:text-primary">{link.name}</a>
                                    )}
                                </div>
                            ))}
                            <div className="pt-4 border-t border-white/5">
                                <button onClick={() => window.location.href = '/get-started'} className="w-full btn-primary">Get Started</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
