import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * The three states every list in the dashboards has to render besides
 * its data: still loading, failed, and genuinely empty.
 *
 * Kept together because they are the same component at three
 * temperatures, and because a project that writes them inline once per
 * table ends up with an empty state in some places and a blank gap in
 * others.
 */

interface SkeletonProps {
    /** Rows of placeholder to draw. */
    rows?: number;
    className?: string;
}

/** Shaped like the content it replaces, so the layout does not jump
 *  when real rows arrive. */
export const Skeleton: React.FC<SkeletonProps> = ({ rows = 3, className }) => (
    <div className={cn('space-y-3', className)} aria-hidden="true">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-sm bg-sand" />
        ))}
    </div>
);

interface LoadingStateProps {
    label?: string;
    className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    label = 'Loading…', className,
}) => (
    <div
        role="status"
        aria-live="polite"
        className={cn('flex items-center justify-center gap-3 py-16 text-muted', className)}
    >
        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        <span className="text-[0.9375rem]">{label}</span>
    </div>
);

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, className }) => (
    <div
        role="alert"
        className={cn('flex flex-col items-center gap-4 px-6 py-16 text-center', className)}
    >
        <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-clay-pale">
            <AlertCircle size={20} strokeWidth={1.75} className="text-clay-ink" aria-hidden="true" />
        </div>
        <div>
            <p className="font-semibold text-ink">Something went wrong</p>
            <p className="mx-auto mt-1 max-w-sm text-[0.875rem] leading-relaxed text-muted">{message}</p>
        </div>
        {onRetry && (
            <button type="button" onClick={onRetry} className="btn-secondary px-5 py-2.5 text-[0.875rem]">
                Try again
            </button>
        )}
    </div>
);

interface EmptyStateProps {
    title: string;
    message?: string;
    icon?: React.ComponentType<{ size?: number | string; className?: string; strokeWidth?: number | string }>;
    /** A single way forward — never a wall of choices in an empty state. */
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title, message, icon: Icon = Inbox, action, className,
}) => (
    <div className={cn('flex flex-col items-center gap-4 px-6 py-14 text-center', className)}>
        <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-sand">
            <Icon size={20} strokeWidth={1.75} className="text-muted" />
        </div>
        <div>
            <p className="font-semibold text-ink">{title}</p>
            {message && (
                <p className="mx-auto mt-1 max-w-sm text-[0.875rem] leading-relaxed text-muted">{message}</p>
            )}
        </div>
        {action}
    </div>
);
