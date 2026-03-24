import React, { createContext, useContext, useState, useEffect } from 'react';

interface InventoryContextType {
    wishlist: string[];
    toggleWishlist: (id: string) => void;
    compareList: string[];
    toggleCompare: (id: string) => void;
    removeFromCompare: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('autosphere_wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const [compareList, setCompareList] = useState<string[]>([]);

    useEffect(() => {
        localStorage.setItem('autosphere_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (id: string) => {
        setWishlist(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleCompare = (id: string) => {
        setCompareList(prev => {
            if (prev.includes(id)) return prev.filter(i => i !== id);
            if (prev.length >= 3) {
                alert('You can compare up to 3 cars at a time.');
                return prev;
            }
            return [...prev, id];
        });
    };

    const removeFromCompare = (id: string) => {
        setCompareList(prev => prev.filter(i => i !== id));
    };

    return (
        <InventoryContext.Provider value={{
            wishlist, toggleWishlist,
            compareList, toggleCompare, removeFromCompare
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const ctx = useContext(InventoryContext);
    if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
    return ctx;
};
