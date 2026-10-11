import React from 'react';
import { cn } from '../../lib/cn';
import type { BookingStatus, VehicleStatus } from '../../types/workshop';

type Status = BookingStatus | VehicleStatus | 'Active' | 'Inactive' | 'Premium' | 'Basic';

/**
 * StatusBadge — one pill, one vocabulary.
 *
 * The mapping lives here rather than in each table so a job that is
 * "In Service" is never clay in one view and forest in the next. Only
 * three treatments exist on purpose: in progress (clay), settled or
 * healthy (forest), and inert (sand).
 */
const TONES: Record<Status, string> = {
    // Bookings
    Pending: 'bg-sand text-muted',
    Confirmed: 'bg-forest-pale text-primary',
    'In Service': 'bg-clay-pale text-clay-ink',
    Completed: 'bg-forest-pale text-primary',
    Cancelled: 'bg-sand text-faint line-through decoration-1',
    // Vehicles
    'At Home': 'bg-sand text-muted',
    'Awaiting Parts': 'bg-clay-pale text-clay-ink',
    'Ready for Pickup': 'bg-forest-pale text-primary',
    // Customers
    Active: 'bg-forest-pale text-primary',
    Inactive: 'bg-sand text-faint',
    Premium: 'bg-forest-pale text-primary',
    Basic: 'bg-sand-deep text-muted',
};

interface StatusBadgeProps {
    status: Status;
    /** Dense variant for table cells. */
    size?: 'sm' | 'md';
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className }) => (
    <span
        className={cn(
            'inline-flex items-center whitespace-nowrap rounded-full font-bold',
            size === 'sm' ? 'px-2 py-0.5 text-[0.6875rem]' : 'px-2.5 py-1 text-xs',
            TONES[status] ?? 'bg-sand text-muted',
            className,
        )}
    >
        {status}
    </span>
);
