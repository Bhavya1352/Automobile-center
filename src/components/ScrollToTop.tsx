import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll position on route change. Jumps rather than animates:
 * a smooth scroll up the length of a long page delays the new view.
 */
const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
