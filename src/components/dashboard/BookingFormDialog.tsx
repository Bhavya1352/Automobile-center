import React, { useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { EmptyState } from '../ui/DataState';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { useWorkshop, vehicleLabel } from '../../hooks/useWorkshop';
import { isBlank } from '../../lib/validation';
import { formatRupees, todayInputValue } from '../../lib/format';
import { BOOKING_SLOTS, SERVICE_OPTIONS, findService } from '../../data/workshopData';
import type { FieldErrors } from '../../lib/validation';
import type { BookingDraft, Customer, OwnedVehicle } from '../../types/workshop';

interface BookingFormDialogProps {
    open: boolean;
    onClose: () => void;
    /** Vehicles the booking may be filed against. In advisor mode this
     *  is the whole fleet; it is narrowed to the chosen customer. */
    vehicles: OwnedVehicle[];
    /** The owner booking for themselves, or the advisor's first pick. */
    customerId: string;
    /** Supplied on the admin side only, which turns on the customer
     *  selector. Absent means "the signed-in owner is booking". */
    customers?: Customer[];
    /** Pre-selection from the control that opened the form. */
    presetVehicleId?: string;
    presetServiceSlug?: string;
    /** Carried over from the AI vehicle check, when that is the origin. */
    presetNotes?: string;
    onBooked?: (bookingId: string) => void;
}

function validate(values: BookingDraft): FieldErrors<BookingDraft> {
    const errors: FieldErrors<BookingDraft> = {};

    if (isBlank(values.customerId)) errors.customerId = 'Choose the customer.';
    if (isBlank(values.vehicleId)) errors.vehicleId = 'Choose which vehicle this is for.';
    if (isBlank(values.serviceSlug)) errors.serviceSlug = 'Choose a service.';
    if (isBlank(values.slot)) errors.slot = 'Choose a drop-off time.';

    if (isBlank(values.scheduledFor)) {
        errors.scheduledFor = 'Choose a date.';
    } else if (Number.isNaN(Date.parse(values.scheduledFor))) {
        errors.scheduledFor = 'Enter a valid date.';
    } else if (values.scheduledFor < todayInputValue()) {
        errors.scheduledFor = 'Pick today or a later date.';
    }

    // Long enough to be useful to the technician, short enough to stay
    // a note rather than a letter.
    if (values.notes.length > 400) errors.notes = 'Please keep this under 400 characters.';

    return errors;
}

/**
 * BookingFormDialog — books a service against one of the owner's cars.
 *
 * The estimate updates as the service changes, and is labelled "from":
 * quoting a firm price for work nobody has looked at yet is exactly
 * what the rest of the site promises not to do.
 *
 * One form serves both dashboards. Passing `customers` turns on the
 * customer selector, which is the only thing an advisor booking on
 * someone's behalf needs that the owner does not.
 */
export const BookingFormDialog: React.FC<BookingFormDialogProps> = ({
    open, onClose, vehicles, customerId, customers,
    presetVehicleId, presetServiceSlug, presetNotes, onBooked,
}) => {
    const { createBooking } = useWorkshop();
    const { showToast } = useToast();

    const initialValues = useMemo<BookingDraft>(() => ({
        customerId,
        vehicleId: presetVehicleId
            ?? vehicles.find(v => v.ownerId === customerId)?.id
            ?? '',
        serviceSlug: presetServiceSlug ?? SERVICE_OPTIONS[0].slug,
        scheduledFor: todayInputValue(),
        slot: BOOKING_SLOTS[1],
        notes: presetNotes ?? '',
    }), [customerId, presetVehicleId, presetServiceSlug, presetNotes, vehicles]);

    const onSubmit = useCallback(async (values: BookingDraft) => {
        const booking = await createBooking(values);
        showToast(`${booking.serviceName} requested — reference ${booking.id}.`);
        onBooked?.(booking.id);
        onClose();
    }, [createBooking, showToast, onBooked, onClose]);

    const form = useForm<BookingDraft>({ initialValues, validate, onSubmit });
    const {
        values, errors, status, submitError, setValue,
        handleChange, handleBlur, handleSubmit, formRef,
    } = form;

    /** Only the chosen customer's cars can be booked in. */
    const bookable = vehicles.filter(v => v.ownerId === values.customerId);

    /** Changing the customer invalidates the vehicle, so it moves with
     *  it rather than leaving the select showing a car they do not own. */
    const changeCustomer = (nextId: string) => {
        setValue('customerId', nextId);
        setValue('vehicleId', vehicles.find(v => v.ownerId === nextId)?.id ?? '');
    };

    const busy = status === 'submitting';
    const service = findService(values.serviceSlug);

    /** Advisor-only control, and the one thing that still has to work
     *  when the chosen customer has nothing to book: it is what the
     *  advisor uses to pick someone who does. */
    const customerField = customers && (
        <Field as="select" label="Customer" name="customerId" value={values.customerId}
            onChange={event => changeCustomer(event.target.value)}
            onBlur={handleBlur} error={errors.customerId}
        >
            {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} · {c.city}</option>
            ))}
        </Field>
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            busy={busy}
            title="Book a service"
            description="A service advisor confirms the slot and assigns a bay the same working day."
            footer={bookable.length > 0 ? (
                <>
                    <button
                        type="button" onClick={onClose} disabled={busy}
                        className="btn-secondary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" form="booking-form" disabled={busy}
                        className="btn-primary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                        {busy ? 'Requesting…' : 'Request booking'}
                    </button>
                </>
            ) : (
                <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-[0.875rem]">
                    Close
                </button>
            )}
        >
            {bookable.length === 0 ? (
                // The selector stays above the empty state, so an advisor
                // who lands on a customer with no car — the newest record
                // is first in the list, and a new one has none yet — can
                // pick another rather than having to close and reopen.
                <div className="space-y-4">
                    {customerField}
                    <EmptyState
                        title="No vehicle to book"
                        message={customers
                            ? 'This customer has no vehicle on record. Choose another customer above, or add a vehicle before booking work against the account.'
                            : 'Add a vehicle to your garage first — a booking has to be filed against a car.'}
                    />
                </div>
            ) : (
                <form id="booking-form" ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                    {submitError && (
                        <p role="alert" className="border border-clay bg-clay-pale px-4 py-3 text-[0.875rem] text-clay-ink">
                            {submitError}
                        </p>
                    )}

                    {customerField}

                    <Field as="select" label="Vehicle" name="vehicleId" value={values.vehicleId}
                        onChange={handleChange} onBlur={handleBlur} error={errors.vehicleId}
                    >
                        {bookable.map(v => (
                            <option key={v.id} value={v.id}>
                                {vehicleLabel(v)} · {v.registration}
                            </option>
                        ))}
                    </Field>

                    <Field as="select" label="Service" name="serviceSlug" value={values.serviceSlug}
                        onChange={handleChange} onBlur={handleBlur} error={errors.serviceSlug}
                        hint={service?.summary}
                    >
                        {SERVICE_OPTIONS.map(option => (
                            <option key={option.slug} value={option.slug}>
                                {option.name} — from {formatRupees(option.fromPrice)}
                            </option>
                        ))}
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="Preferred date" name="scheduledFor" type="date"
                            min={todayInputValue()}
                            value={values.scheduledFor}
                            onChange={handleChange} onBlur={handleBlur}
                            error={errors.scheduledFor}
                        />
                        <Field as="select" label="Drop-off time" name="slot" value={values.slot}
                            onChange={handleChange} onBlur={handleBlur} error={errors.slot}
                        >
                            {BOOKING_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </Field>
                    </div>

                    <Field
                        as="textarea" label="What should the technician know?" optional
                        name="notes" rows={3} value={values.notes}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.notes}
                        placeholder="Pedal pulses under heavy braking above 80 km/h."
                        hint="Describe the symptom in your own words — it reaches the technician before the car does."
                    />

                    {service && (
                        <dl className="border-t border-line pt-4 text-[0.875rem]">
                            <div className="flex justify-between py-1">
                                <dt className="text-muted">Estimate</dt>
                                <dd className="font-semibold text-ink">from {formatRupees(service.fromPrice)}</dd>
                            </div>
                            <div className="flex justify-between py-1">
                                <dt className="text-muted">Typical duration</dt>
                                <dd className="text-ink">{service.duration}</dd>
                            </div>
                        </dl>
                    )}
                </form>
            )}
        </Modal>
    );
};
