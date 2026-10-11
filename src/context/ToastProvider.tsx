import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { ToastContext } from './toastContext';
import type { ToastType } from './toastContext';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

const TOAST_DURATION_MS = 4000;
let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);
        window.setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, TOAST_DURATION_MS);
    }, []);

    const dismiss = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Memoised: showToast is stable, so consumers never re-render when a
    // toast appears or dismisses.
    const value = useMemo(() => ({ showToast }), [showToast]);

    const icons = {
        success: <CheckCircle2 size={17} strokeWidth={1.75} className="text-forest" />,
        error: <XCircle size={17} strokeWidth={1.75} className="text-clay-ink" />,
        info: <Info size={17} strokeWidth={1.75} className="text-muted" />,
    };

    const accents = {
        success: 'border-l-forest',
        error: 'border-l-clay',
        info: 'border-l-line-strong',
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Toast Container — fixed bottom-right */}
            <div
                className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none"
                role="status"
                aria-live="polite"
            >
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, x: 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className={`pointer-events-auto flex min-w-[280px] max-w-[400px] items-center gap-3 border border-line border-l-2 bg-surface px-4 py-3 shadow-[0_6px_24px_-12px_rgba(23,26,24,0.25)] ${accents[toast.type]}`}
                        >
                            {icons[toast.type]}
                            <p className="flex-1 text-[0.875rem] leading-snug text-ink">{toast.message}</p>
                            <button
                                onClick={() => dismiss(toast.id)}
                                aria-label="Dismiss notification"
                                className="ml-2 text-faint transition-colors hover:text-ink"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
