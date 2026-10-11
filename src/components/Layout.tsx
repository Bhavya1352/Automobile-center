import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    showFooter?: boolean;
}

/**
 * Layout — owns the offset for the fixed navbar so pages never have
 * to add their own top padding.
 */
const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => (
    <div className="flex min-h-screen flex-col pt-[72px]">
        {/* Lets keyboard users jump the navigation on every page. */}
        <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-forest focus:px-4 focus:py-2 focus:text-paper"
        >
            Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="flex-grow outline-none">
            {children}
        </main>
        {showFooter && <Footer />}
    </div>
);

export default Layout;
