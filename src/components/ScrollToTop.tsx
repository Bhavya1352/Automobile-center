import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — Automatically scrolls to top on route changes.
 * Fixes the common React Router issue where navigating to a new 
 * page retains the previous scroll position, improving UX by 100%.
 */
const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
