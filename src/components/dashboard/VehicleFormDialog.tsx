import React, { useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { useWorkshop } from '../../hooks/useWorkshop';
import { isBlank } from '../../lib/validation';
import { FUEL_TYPES } from '../../types/workshop';
import type { FieldErrors } from '../../lib/validation';
import type { OwnedVehicle, VehicleDraft } from '../../types/workshop';

interface VehicleFormDialogProps {
    open: boolean;
    onClose: () => void;
    /** Present for an edit, absent for an addition. */
    vehicle?: OwnedVehicle | null;
    /** Owner the new vehicle is filed under. */
    ownerId: string;
}

const EMPTY: VehicleDraft = {
    make: '', model: '', variant: '', year: '',
    registration: '', fuel: 'Petrol', odometerKm: '', insuranceValidTill: '',
};

/** Cars older than this were not sold with the systems the workshop
 *  diagnoses, and a four-digit year is the only thing worth enforcing. */
const EARLIEST_YEAR = 1980;
/** A plate like "MH 12 QR 4821" — two letters, two digits, one or two
 *  letters, four digits. Spacing is optional; it is normalised on save. */
const PLATE = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/i;

function validate(values: VehicleDraft): FieldErrors<VehicleDraft> {
    const errors: FieldErrors<VehicleDraft> = {};
    const thisYear = new Date().getFullYear();

    if (isBlank(values.make)) errors.make = 'Tell us the manufacturer, e.g. BMW.';
    if (isBlank(values.model)) errors.model = 'Tell us the model, e.g. 3 Series.';

    const year = Number(values.year);
    if (isBlank(values.year)) errors.year = 'Enter the model year.';
    else if (!Number.isInteger(year) || year < EARLIEST_YEAR || year > thisYear + 1) {
        errors.year = `Enter a year between ${EARLIEST_YEAR} and ${thisYear + 1}.`;
    }

    if (isBlank(values.registration)) errors.registration = 'Enter the registration number.';
    else if (!PLATE.test(values.registration.trim())) {
        errors.registration = 'Use the format on the plate, e.g. MH 12 QR 4821.';
    }

    const km = Number(values.odometerKm.replace(/[^\d]/g, ''));
    if (isBlank(values.odometerKm)) errors.odometerKm = 'Enter the current odometer reading.';
    else if (!Number.isFinite(km) || km < 0) errors.odometerKm = 'Enter the reading in kilometres.';
    else if (km > 1_000_000) errors.odometerKm = 'That reading looks too high — check the digits.';

    if (values.insuranceValidTill && Number.isNaN(Date.parse(values.insuranceValidTill))) {
        errors.insuranceValidTill = 'Enter a valid date, or leave this blank.';
    }

    return errors;
}

/**
 * VehicleFormDialog — adds a car to the garage, or corrects one.
 *
 * One form for both: the fields and the rules are identical, and the
 * only difference is which mutation the submit calls and what the
 * toast says afterwards. Registration uniqueness is checked by the
 * provider rather than here, because this form cannot know what is
 * already in the garage; that rejection surfaces as a form-level error.
 */
export const VehicleFormDialog: React.FC<VehicleFormDialogProps> = ({
    open, onClose, vehicle, ownerId,
}) => {
    const { addVehicle, updateVehicle } = useWorkshop();
    const { showToast } = useToast();
    const editing = Boolean(vehicle);

    const initialValues = useMemo<VehicleDraft>(() => (vehicle ? {
        make: vehicle.make,
        model: vehicle.model,
        variant: vehicle.variant ?? '',
        year: String(vehicle.year),
        registration: vehicle.registration,
        fuel: vehicle.fuel,
        odometerKm: String(vehicle.odometerKm),
        insuranceValidTill: vehicle.insuranceValidTill ?? '',
    } : EMPTY), [vehicle]);

    const onSubmit = useCallback(async (values: VehicleDraft) => {
        if (vehicle) {
            await updateVehicle(vehicle.id, values);
            showToast(`${values.make} ${values.model} updated.`);
        } else {
            await addVehicle(values, ownerId);
            showToast(`${values.make} ${values.model} added to your garage.`);
        }
        onClose();
    }, [vehicle, updateVehicle, addVehicle, ownerId, showToast, onClose]);

    const form = useForm<VehicleDraft>({ initialValues, validate, onSubmit });
    const { values, errors, status, submitError, handleChange, handleBlur, handleSubmit, formRef } = form;

    const busy = status === 'submitting';

    // The dialog is unmounted between openings by its parent, so there
    // is no stale draft to clear here.
    return (
        <Modal
            open={open}
            onClose={onClose}
            busy={busy}
            title={editing ? `Edit ${vehicle?.make} ${vehicle?.model}` : 'Add a vehicle'}
            description={editing
                ? 'Corrections are saved to this browser.'
                : 'Three details are enough to get started — the rest can wait.'}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="btn-secondary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="vehicle-form"
                        disabled={busy}
                        className="btn-primary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                        {busy ? 'Saving…' : editing ? 'Save changes' : 'Add vehicle'}
                    </button>
                </>
            }
        >
            <form id="vehicle-form" ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                {submitError && (
                    <p role="alert" className="border border-clay bg-clay-pale px-4 py-3 text-[0.875rem] text-clay-ink">
                        {submitError}
                    </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Manufacturer" name="make" value={values.make}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.make} autoComplete="off" placeholder="BMW"
                    />
                    <Field
                        label="Model" name="model" value={values.model}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.model} autoComplete="off" placeholder="3 Series"
                    />
                    <Field
                        label="Variant" optional name="variant" value={values.variant}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.variant} autoComplete="off" placeholder="320d M Sport"
                    />
                    <Field
                        label="Model year" name="year" type="number" inputMode="numeric"
                        value={values.year}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.year} placeholder="2022"
                    />
                    <Field
                        label="Registration" name="registration" value={values.registration}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.registration} autoComplete="off"
                        placeholder="MH 12 QR 4821"
                        className="sm:col-span-2"
                        hint="As printed on the plate."
                    />
                    <Field as="select" label="Fuel" name="fuel" value={values.fuel}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.fuel}
                    >
                        {FUEL_TYPES.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
                    </Field>
                    <Field
                        label="Odometer (km)" name="odometerKm" inputMode="numeric"
                        value={values.odometerKm}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.odometerKm} placeholder="42850"
                    />
                    <Field
                        label="Insurance valid till" optional name="insuranceValidTill" type="date"
                        value={values.insuranceValidTill}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.insuranceValidTill}
                        className="sm:col-span-2"
                        hint="We use this only to remind you before it lapses."
                    />
                </div>
            </form>
        </Modal>
    );
};
