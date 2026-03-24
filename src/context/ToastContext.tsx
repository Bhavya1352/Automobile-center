import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const dismiss = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const icons = {
        success: <CheckCircle2 size={18} className="text-emerald-400" />,
        error: <XCircle size={18} className="text-red-400" />,
        info: <Info size={18} className="text-blue-400" />,
    };

    const borderColors = {
        success: 'border-emerald-500/30',
        error: 'border-red-500/30',
        info: 'border-blue-500/30',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container — fixed bottom-right */}
            <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, x: 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl bg-secondary/95 backdrop-blur-xl border ${borderColors[toast.type]} shadow-2xl shadow-black/40 min-w-[280px] max-w-[400px]`}
                        >
                            {icons[toast.type]}
                            <p className="text-white/80 text-sm font-medium flex-1">{toast.message}</p>
                            <button
                                onClick={() => dismiss(toast.id)}
                                className="text-white/20 hover:text-white/60 transition-colors ml-2"
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

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};
