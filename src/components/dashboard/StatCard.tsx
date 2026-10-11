import React from 'react';
import { cn } from '../../lib/cn';

interface StatCardProps {
    icon?: React.ComponentType<{ size?: number | string; className?: string }>;
    label: string;
    value: React.ReactNode;
    /** Supporting line: a trend, a count, a qualifier. */
    note?: React.ReactNode;
    /** Makes the whole card a button — used where a figure has a view
     *  behind it. Cards without one stay plain divs rather than
     *  pretending to be interactive. */
    onClick?: () => void;
    className?: string;
}

/**
 * StatCard — the figure-and-label tile both dashboards repeat.
 *
 * Purely presentational: it formats nothing and derives nothing, so
 * the same tile serves a rupee total, a vehicle count and a
 * percentage without learning about any of them.
 */
export const StatCard: React.FC<StatCardProps> = ({
    icon: Icon, label, value, note, onClick, className,
}) => {
    const body = (
        <>
            {Icon && (
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-sm bg-forest-pale">
                    <Icon size={17} className="text-primary" />
                </div>
            )}
            <div className="stat text-[1.625rem]">{value}</div>
            <div className="spec-label mt-2">{label}</div>
            {note && <div className="mt-1 text-xs text-muted">{note}</div>}
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={cn(
                    'panel border-line p-5 text-left transition-colors hover:border-forest',
                    className,
                )}
            >
                {body}
            </button>
        );
    }

    return (
        <div className={cn('panel border-line p-5 transition-colors hover:border-forest', className)}>
            {body}
        </div>
    );
};
