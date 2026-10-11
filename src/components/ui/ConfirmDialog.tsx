import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    /** What will happen, in a sentence the user can act on. */
    message: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Destructive actions get the clay treatment and a warning icon. */
    tone?: 'default' | 'danger';
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
}

/**
 * ConfirmDialog — the pause before something irreversible.
 *
 * Owns the in-flight and failed states of the action it confirms, so
 * callers pass a promise and nothing else: the button shows a spinner
 * while the write runs, the dialog refuses to close under it, and a
 * rejection is shown in place rather than closing on a failure the
 * user never sees.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
    tone = 'default', onConfirm, onClose,
}) => {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // A dialog reopened after a failure starts clean.
    useEffect(() => {
        if (open) setError(null);
    }, [open]);

    const confirm = async () => {
        setBusy(true);
        setError(null);
        try {
            await onConfirm();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'That did not work. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="sm"
            busy={busy}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="btn-secondary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={confirm}
                        disabled={busy}
                        className="btn-primary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-60"
                        style={tone === 'danger' ? { background: 'var(--color-clay-ink)' } : undefined}
                    >
                        {busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                        {busy ? 'Working…' : confirmLabel}
                    </button>
                </>
            }
        >
            <div className="flex gap-4">
                {tone === 'danger' && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-clay-pale">
                        <AlertTriangle size={17} strokeWidth={1.75} className="text-clay-ink" aria-hidden="true" />
                    </div>
                )}
                <div className="min-w-0 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {message}
                    {error && (
                        <p role="alert" className="mt-3 text-[0.8125rem] text-clay-ink">{error}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};
