import React from 'react';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';
import { useWorkshop, vehicleLabel } from '../../hooks/useWorkshop';
import { formatDate, formatRupees } from '../../lib/format';
import { BOOKING_STATUSES, CANCELLABLE_STATUSES } from '../../types/workshop';
import type { Booking, BookingStatus } from '../../types/workshop';
import { cn } from '../../lib/cn';

interface BookingDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    booking: Booking | null;
    /** Offered only while the job can still be called off. */
    onCancel?: (booking: Booking) => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0">
        <dt className="text-[0.8125rem] text-muted">{label}</dt>
        <dd className="text-right text-[0.875rem] font-medium text-ink">{children}</dd>
    </div>
);

/** Progress through the job, Cancelled excluded — a called-off booking
 *  has left the pipeline rather than reached its end. */
const PIPELINE: readonly BookingStatus[] = BOOKING_STATUSES.filter(s => s !== 'Cancelled');

/**
 * BookingDetailsDialog — one job, as the owner sees it.
 *
 * The progress track is derived from the booking's status rather than
 * hard-coded steps, so the admin moving a job to "In Service" is
 * visible here immediately.
 */
export const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({
    open, onClose, booking, onCancel,
}) => {
    const { vehicles } = useWorkshop();
    if (!booking) return null;

    const vehicle = vehicles.find(v => v.id === booking.vehicleId);
    const reached = PIPELINE.indexOf(booking.status);
    const cancellable = CANCELLABLE_STATUSES.includes(booking.status);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={booking.serviceName}
            description={`${booking.id} · ${vehicleLabel(vehicle)}${vehicle ? ` · ${vehicle.registration}` : ''}`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-[0.875rem]">
                        Close
                    </button>
                    {cancellable && onCancel && (
                        <button
                            type="button"
                            onClick={() => onCancel(booking)}
                            className="btn-primary px-5 py-2.5 text-[0.875rem]"
                            style={{ background: 'var(--color-clay-ink)' }}
                        >
                            Cancel booking
                        </button>
                    )}
                </>
            }
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <StatusBadge status={booking.status} />
                    <p className="text-[0.875rem] text-muted">
                        Estimate <span className="font-semibold text-ink">from {formatRupees(booking.estimate)}</span>
                    </p>
                </div>

                {booking.status === 'Cancelled' ? (
                    <p className="border border-line bg-sand px-4 py-3 text-[0.875rem] text-muted">
                        This booking was cancelled. Book again whenever suits you — nothing has been charged.
                    </p>
                ) : (
                    <ol className="space-y-3">
                        {PIPELINE.map((step, i) => {
                            const done = i <= reached;
                            const current = i === reached;
                            return (
                                <li key={step} className="flex items-center gap-3">
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'h-2 w-2 shrink-0 rounded-full',
                                            done ? 'bg-primary' : 'bg-sand-deep',
                                        )}
                                    />
                                    <span className={cn(
                                        'text-[0.875rem]',
                                        current ? 'font-semibold text-ink' : done ? 'text-ink-soft' : 'text-muted',
                                    )}>
                                        {step}
                                    </span>
                                    {current && (
                                        <span className="text-xs font-bold text-primary">Current</span>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                )}

                <dl>
                    <Row label="Scheduled for">{formatDate(booking.scheduledFor)} · {booking.slot}</Row>
                    <Row label="Bay">{booking.bay ?? <span className="text-muted">To be assigned</span>}</Row>
                    <Row label="Technician">{booking.technician ?? <span className="text-muted">To be assigned</span>}</Row>
                    {vehicle && <Row label="Registration">{vehicle.registration}</Row>}
                </dl>

                {booking.notes && (
                    <div>
                        <p className="spec-label">What you told us</p>
                        <p className="mt-2 border-l-2 border-line pl-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                            {booking.notes}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
