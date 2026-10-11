import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { useToast } from '../../hooks/useToast';
import { useWorkshop, vehicleLabel } from '../../hooks/useWorkshop';
import { formatDate, formatRupees } from '../../lib/format';
import { BAYS, TECHNICIANS } from '../../data/workshopData';
import { BOOKING_STATUSES } from '../../types/workshop';
import type { Booking, BookingStatus } from '../../types/workshop';

interface JobUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    booking: Booking | null;
}

const UNASSIGNED = '';

/**
 * JobUpdateDialog — the advisor's edit of a job on the floor: where it
 * is, who has it, and how far along it is.
 *
 * All three changes are applied together on save rather than firing a
 * write per control, so moving a car into a bay and assigning the
 * technician is one action in the activity log and one undo in the
 * user's head.
 */
export const JobUpdateDialog: React.FC<JobUpdateDialogProps> = ({ open, onClose, booking }) => {
    const { vehicles, customers, setBookingStatus, assignBooking } = useWorkshop();
    const { showToast } = useToast();

    const [status, setStatus] = useState<BookingStatus>(booking?.status ?? 'Pending');
    const [bay, setBay] = useState(booking?.bay ?? UNASSIGNED);
    const [technician, setTechnician] = useState(booking?.technician ?? UNASSIGNED);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!booking) return null;

    const vehicle = vehicles.find(v => v.id === booking.vehicleId);
    const customer = customers.find(c => c.id === booking.customerId);

    const dirty = status !== booking.status
        || bay !== (booking.bay ?? UNASSIGNED)
        || technician !== (booking.technician ?? UNASSIGNED);

    const save = async () => {
        setBusy(true);
        setError(null);
        try {
            if (bay !== (booking.bay ?? UNASSIGNED) || technician !== (booking.technician ?? UNASSIGNED)) {
                await assignBooking(booking.id, {
                    bay: bay === UNASSIGNED ? null : bay,
                    technician: technician === UNASSIGNED ? null : technician,
                });
            }
            if (status !== booking.status) {
                await setBookingStatus(booking.id, status);
            }
            showToast(`${booking.id} updated.`);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'The job could not be updated.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            busy={busy}
            title={`Update ${booking.id}`}
            description={`${booking.serviceName} · ${vehicleLabel(vehicle)}${vehicle ? ` · ${vehicle.registration}` : ''}`}
            footer={
                <>
                    <button
                        type="button" onClick={onClose} disabled={busy}
                        className="btn-secondary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" form="job-form" disabled={busy || !dirty}
                        className="btn-primary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                        {busy ? 'Saving…' : 'Save changes'}
                    </button>
                </>
            }
        >
            <form
                id="job-form"
                onSubmit={event => { event.preventDefault(); void save(); }}
                className="space-y-4"
            >
                {error && (
                    <p role="alert" className="border border-clay bg-clay-pale px-4 py-3 text-[0.875rem] text-clay-ink">
                        {error}
                    </p>
                )}

                <dl className="border-b border-line pb-4 text-[0.875rem]">
                    <div className="flex justify-between py-1">
                        <dt className="text-muted">Customer</dt>
                        <dd className="font-medium text-ink">{customer?.name ?? 'Unknown'}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                        <dt className="text-muted">Scheduled</dt>
                        <dd className="text-ink">{formatDate(booking.scheduledFor)} · {booking.slot}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                        <dt className="text-muted">Estimate</dt>
                        <dd className="text-ink">from {formatRupees(booking.estimate)}</dd>
                    </div>
                </dl>

                <Field
                    as="select" label="Status" name="status" value={status}
                    onChange={event => setStatus(event.target.value as BookingStatus)}
                    hint="Moving a job to In Service or Completed updates what the owner sees on their own dashboard."
                >
                    {BOOKING_STATUSES.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        as="select" label="Bay" name="bay" value={bay}
                        onChange={event => setBay(event.target.value)}
                    >
                        <option value={UNASSIGNED}>Not assigned</option>
                        {BAYS.map(option => <option key={option} value={option}>{option}</option>)}
                    </Field>
                    <Field
                        as="select" label="Technician" name="technician" value={technician}
                        onChange={event => setTechnician(event.target.value)}
                    >
                        <option value={UNASSIGNED}>Not assigned</option>
                        {TECHNICIANS.map(option => <option key={option} value={option}>{option}</option>)}
                    </Field>
                </div>

                {booking.notes && (
                    <div>
                        <p className="spec-label">Customer note</p>
                        <p className="mt-2 border-l-2 border-line pl-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                            {booking.notes}
                        </p>
                    </div>
                )}
            </form>
        </Modal>
    );
};
