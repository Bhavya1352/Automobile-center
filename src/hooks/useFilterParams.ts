import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * useFilterParams — Syncs filter state with URL search params.
 * 
 * Real-world pattern used in e-commerce (Amazon, Flipkart):
 * - User filters → URL updates → shareable link
 * - User opens shared link → filters auto-apply
 * - Browser back/forward works correctly with filters
 * 
 * Example URL: /inventory?q=ferrari&type=Coupe&maxPrice=300000&sort=price-asc
 */
export function useFilterParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo(() => ({
        search: searchParams.get('q') || '',
        type: searchParams.get('type') || 'All',
        maxPrice: parseInt(searchParams.get('maxPrice') || '400000'),
        sort: (searchParams.get('sort') as 'price-asc' | 'price-desc' | 'hp-desc') || 'price-asc',
    }), [searchParams]);

    const setFilter = useCallback((key: string, value: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            // Remove default values from URL to keep it clean
            if (
                (key === 'q' && value === '') ||
                (key === 'type' && value === 'All') ||
                (key === 'maxPrice' && value === '400000') ||
                (key === 'sort' && value === 'price-asc')
            ) {
                next.delete(key);
            } else {
                next.set(key, value);
            }
            return next;
        }, { replace: true } // Don't add to browser history for every filter change
        );
    }, [setSearchParams]);

    const resetFilters = useCallback(() => {
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    return { filters, setFilter, resetFilters };
}
