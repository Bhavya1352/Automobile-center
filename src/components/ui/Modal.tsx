import React, { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    /** Supporting line under the title, announced with it. */
    description?: string;
    /** Footer actions. Rendered inside the dialog, below the content. */
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    /** Set while a submission is in flight: the dialog stops closing on
     *  Escape or backdrop click so a half-finished write is not lost. */
    busy?: boolean;
    children: React.ReactNode;
}

const SIZES = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
} as const;

/** Everything that can hold focus inside the dialog, in tab order. */
const FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Modal — a real dialog, not a div that happens to float.
 *
 * Rendered into document.body so no ancestor's overflow or transform
 * can clip it. It takes focus on open, keeps Tab inside itself while
 * open, closes on Escape, and returns focus to the control that opened
 * it — the four things that separate an accessible dialog from a
 * keyboard trap. Background scrolling is locked so the page behind
 * does not drift while a form is open.
 */
export const Modal: React.FC<ModalProps> = ({
    open, onClose, title, description, footer, size = 'md', busy = false, children,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const restoreTo = useRef<HTMLElement | null>(null);
    const id = useId();
    const titleId = `${id}-title`;
    const descriptionId = `${id}-description`;

    const requestClose = useCallback(() => {
        if (!busy) onClose();
    }, [busy, onClose]);

    // Remember the trigger, move focus in, and put it back on close.
    useEffect(() => {
        if (!open) return;
        restoreTo.current = document.activeElement as HTMLElement | null;

        // Deferred a frame: the panel is not in the DOM until the
        // entrance animation has mounted it.
        const raf = requestAnimationFrame(() => {
            const panel = panelRef.current;
            if (!panel) return;
            const first = panel.querySelector<HTMLElement>(FOCUSABLE);
            (first ?? panel).focus();
        });

        return () => {
            cancelAnimationFrame(raf);
            restoreTo.current?.focus?.();
        };
    }, [open]);

    // Escape to dismiss, Tab cycled within the panel.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                requestClose();
                return;
            }
            if (event.key !== 'Tab') return;

            const panel = panelRef.current;
            if (!panel) return;
            const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
                .filter(el => el.offsetParent !== null || el === document.activeElement);
            if (items.length === 0) {
                event.preventDefault();
                panel.focus();
                return;
            }

            const first = items[0];
            const last = items[items.length - 1];
            if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            } else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
                event.preventDefault();
                last.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
    }, [open, requestClose]);

    // Lock background scroll without the layout shift that removing the
    // scrollbar would otherwise cause.
    useEffect(() => {
        if (!open) return;
        const { body, documentElement } = document;
        const previousOverflow = body.style.overflow;
        const previousPadding = body.style.paddingRight;
        const gap = window.innerWidth - documentElement.clientWidth;

        body.style.overflow = 'hidden';
        if (gap > 0) body.style.paddingRight = `${gap}px`;

        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPadding;
        };
    }, [open]);

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16 }}
                        onClick={requestClose}
                        className="absolute inset-0 bg-ink/35"
                        aria-hidden="true"
                    />

                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={description ? descriptionId : undefined}
                        tabIndex={-1}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className={cn(
                            'relative flex max-h-[92dvh] w-full flex-col bg-surface shadow-[0_24px_64px_-32px_rgba(23,26,24,0.45)]',
                            'rounded-t-sm border border-line sm:rounded-sm',
                            // As a bottom sheet the last row sat under the iOS
                            // home indicator; clear it on mobile only.
                            'pb-[env(safe-area-inset-bottom)] sm:pb-0',
                            SIZES[size],
                            'sm:mx-4',
                        )}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
                            <div className="min-w-0">
                                <h2 id={titleId} className="text-[1.0625rem] font-bold tracking-[-0.012em] text-ink">
                                    {title}
                                </h2>
                                {description && (
                                    <p id={descriptionId} className="mt-1 text-[0.8125rem] leading-snug text-muted">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={requestClose}
                                disabled={busy}
                                aria-label={`Close ${title}`}
                                className="-mr-1 -mt-1 shrink-0 rounded-sm p-1.5 text-faint transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <X size={18} strokeWidth={1.75} />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
                            {children}
                        </div>

                        {footer && (
                            <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
};
