import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MAX_COMPARE } from '../types/inventory';
import type { CompareToggleResult, InventoryContextValue } from '../types/inventory';
import { readJson, writeJson } from '../lib/storage';
import { InventoryContext } from './inventoryContext';

const WISHLIST_KEY = 'autosphere.wishlist';
const COMPARE_KEY = 'autosphere.compare';

/**
 * Shortlists the user builds while browsing. Both lists persist, so a
 * refresh on /compare does not empty the tray.
 */
export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<string[]>(() => readJson(WISHLIST_KEY, []));
    const [compareList, setCompareList] = useState<string[]>(() => readJson(COMPARE_KEY, []));

    useEffect(() => { writeJson(WISHLIST_KEY, wishlist); }, [wishlist]);
    useEffect(() => { writeJson(COMPARE_KEY, compareList); }, [compareList]);

    const toggleWishlist = useCallback((id: string) => {
        let added = false;
        setWishlist(prev => {
            added = !prev.includes(id);
            return added ? [...prev, id] : prev.filter(i => i !== id);
        });
        return added;
    }, []);

    const toggleCompare = useCallback((id: string): CompareToggleResult => {
        let result: CompareToggleResult = 'added';
        setCompareList(prev => {
            if (prev.includes(id)) {
                result = 'removed';
                return prev.filter(i => i !== id);
            }
            if (prev.length >= MAX_COMPARE) {
                result = 'limit-reached';
                return prev;
            }
            result = 'added';
            return [...prev, id];
        });
        return result;
    }, []);

    const removeFromCompare = useCallback((id: string) => {
        setCompareList(prev => prev.filter(i => i !== id));
    }, []);

    const clearCompare = useCallback(() => setCompareList([]), []);

    const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);
    const isCompared = useCallback((id: string) => compareList.includes(id), [compareList]);

    // Memoised so consumers only re-render when a list actually changes.
    const value = useMemo<InventoryContextValue>(() => ({
        wishlist, isWishlisted, toggleWishlist,
        compareList, isCompared, toggleCompare, removeFromCompare, clearCompare,
    }), [wishlist, isWishlisted, toggleWishlist,
        compareList, isCompared, toggleCompare, removeFromCompare, clearCompare]);

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};
