import React, { createContext, useContext, useState, useEffect } from 'react';

type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
    direction: Direction;
    toggleDirection: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [direction, setDirection] = useState<Direction>('ltr');

    useEffect(() => {
        // Set dir on <html> — causes entire layout to mirror via Tailwind RTL variants.
        // The Hero section overrides this with an explicit dir="ltr" attribute.
        document.documentElement.setAttribute('dir', direction);
        document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
    }, [direction]);

    const toggleDirection = () => {
        setDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr');
    };

    return (
        <LanguageContext.Provider value={{ direction, toggleDirection }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
