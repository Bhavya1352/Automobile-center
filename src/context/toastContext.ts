import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

/** Context object only — see toastContext.ts sibling files. */
export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
