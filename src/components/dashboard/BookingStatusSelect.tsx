import React, { useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useWorkshop } from '../../hooks/useWorkshop';
import { BOOKING_STATUSES } from '../../types/workshop';
import { cn } from '../../lib/cn';
import type { Booking, BookingStatus } from '../../types/workshop';

interface BookingStatusSelectProps {
    booking: Booking;
    className?: string;
}

/** Same vocabulary as StatusBadge, applied to the control itself so a
 *  job in the workshop reads clay here as well as in the table. */
const TONES: Record<BookingStatus, string> = {
    Pending: 'bg-sand text-muted',
    Confirmed: 'bg-forest-pale text-primary',
    'In Service': 'bg-clay-pale text-clay-ink',
    Completed: 'bg-forest-pale text-primary',
    Cancelled: 'bg-sand text-faint',
};

/**
 * BookingStatusSelect — the advisor's status control.
 *
 * A native <select>, not a custom menu: it is keyboard-operable,
 * announces itself as a listbox, and on a phone opens the platform
 * picker rather than a cramped popover. The styling is applied to the
 * element itself, so nothing is lost by using the real control.
 *
 * The write is awaited, so the control is disabled while the change is
 * in flight and reverts visibly if it fails rather than lying about
 * having saved.
 */
export const BookingStatusSelect: React.FC<BookingStatusSelectProps> = ({
    booking, className,
}) => {
    const { setBookingStatus } = useWorkshop();
    const { showToast } = useToast();
    const [busy, setBusy] = useState(false);

    const change = async (next: BookingStatus) => {
        if (next === booking.status) return;
        setBusy(true);
        try {
            await setBookingStatus(booking.id, next);
            showToast(`${booking.id} moved to ${next}.`);
        } catch (err) {
            showToast(
                err instanceof Error ? err.message : `${booking.id} could not be updated.`,
                'error',
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <span className={cn('relative inline-flex items-center', className)}>
            <select
                value={booking.status}
                disabled={busy}
                aria-label={`Status for ${booking.id}, ${booking.serviceName}`}
                onChange={event => void change(event.target.value as BookingStatus)}
                className={cn(
                    'cursor-pointer appearance-none rounded-full border border-line py-1 pl-2.5 pr-7 text-xs font-bold',
                    'transition-colors hover:border-line-strong disabled:cursor-wait disabled:opacity-60',
                    TONES[booking.status],
                )}
            >
                {BOOKING_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-2 flex">
                {busy
                    ? <Loader2 size={11} className="animate-spin" />
                    : <ChevronDown size={11} />}
            </span>
        </span>
    );
};
