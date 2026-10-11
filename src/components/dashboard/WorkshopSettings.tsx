import React, { useCallback } from 'react';
import { Cpu, Shield, Zap } from 'lucide-react';
import { Field } from '../ui/Field';
import { useForm } from '../../hooks/useForm';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../hooks/useToast';
import { isBlank, isEmail, isPhone } from '../../lib/validation';
import type { FieldErrors } from '../../lib/validation';

interface WorkshopSettingsProps {
    /** Clears the persisted workshop snapshot. */
    onResetWorkshop: () => void;
}

/* ── Workshop details ──────────────────────────────────────── */

interface WorkshopValues extends Record<string, string> {
    name: string;
    phone: string;
    email: string;
    city: string;
    bays: string;
    hours: string;
}

const DEFAULT_WORKSHOP: WorkshopValues = {
    name: 'AutoSphere Andheri East',
    phone: '+91 22 4488 1200',
    email: 'service@autosphere.tech',
    city: 'Mumbai',
    bays: '4',
    hours: 'Mon–Fri 8:30–19:00, Sat 9:00–17:00',
};

function validateWorkshop(values: WorkshopValues): FieldErrors<WorkshopValues> {
    const errors: FieldErrors<WorkshopValues> = {};
    if (isBlank(values.name)) errors.name = 'The workshop needs a name.';
    if (isBlank(values.phone)) errors.phone = 'A number customers can call.';
    else if (!isPhone(values.phone)) errors.phone = 'That does not look like a phone number.';
    if (isBlank(values.email)) errors.email = 'An address for booking notifications.';
    else if (!isEmail(values.email)) errors.email = 'Check the address — it looks incomplete.';
    if (isBlank(values.city)) errors.city = 'Which city is the workshop in?';

    const bays = Number(values.bays);
    if (isBlank(values.bays)) errors.bays = 'How many bays does the floor have?';
    else if (!Number.isInteger(bays) || bays < 1 || bays > 99) errors.bays = 'Enter a whole number between 1 and 99.';

    if (isBlank(values.hours)) errors.hours = 'When is the workshop open?';
    return errors;
}

/* ── Alert preferences ─────────────────────────────────────── */

const ALERTS = [
    { id: 'newBookings', label: 'Email alerts for new bookings' },
    { id: 'bayChanges', label: 'SMS when a bay status changes' },
    { id: 'dailyRevenue', label: 'Daily revenue summary' },
    { id: 'lowInventory', label: 'Low inventory notifications' },
    { id: 'shiftReminders', label: 'Technician shift reminders' },
] as const;

type AlertPrefs = Record<(typeof ALERTS)[number]['id'], boolean>;

const DEFAULT_ALERTS: AlertPrefs = {
    newBookings: true,
    bayChanges: false,
    dailyRevenue: true,
    lowInventory: true,
    shiftReminders: false,
};

const INTEGRATIONS = [
    { icon: Cpu, label: 'Bosch ESI diagnostic suite', status: 'Connected' },
    { icon: Shield, label: 'CRM and customer portal', status: 'Connected' },
    { icon: Zap, label: 'Inventory management system', status: 'Pending' },
] as const;

/**
 * WorkshopSettings — the admin's own configuration.
 *
 * The same shape as the owner's settings tab, for the same reason: it
 * is a component so the form initialises from the stored values rather
 * than from the empty strings a page-level `useState` would have
 * captured while the workshop was still loading.
 */
export const WorkshopSettings: React.FC<WorkshopSettingsProps> = ({ onResetWorkshop }) => {
    const { showToast } = useToast();
    const [stored, setStored, resetStored] = usePersistentState<WorkshopValues>(
        'autosphere.workshop.details', DEFAULT_WORKSHOP,
    );
    const [alerts, setAlerts, resetAlerts] = usePersistentState<AlertPrefs>(
        'autosphere.prefs.alerts', DEFAULT_ALERTS,
    );

    const form = useForm<WorkshopValues>({
        initialValues: stored,
        validate: validateWorkshop,
        onSubmit: useCallback(async (values: WorkshopValues) => {
            setStored(values);
            showToast('Workshop details saved.');
        }, [setStored, showToast]),
    });
    const {
        values, errors, status, submitError, reset,
        handleChange, handleBlur, handleSubmit, formRef,
    } = form;
    const busy = status === 'submitting';

    return (
        <div className="max-w-2xl space-y-5">
            <h2 className="text-xl font-bold text-ink">System settings</h2>

            <form ref={formRef} onSubmit={handleSubmit} noValidate className="panel space-y-5 p-6">
                <h3 className="border-b border-line pb-3 font-semibold text-ink">Workshop information</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                        label="Workshop name" name="name" value={values.name}
                        onChange={handleChange} onBlur={handleBlur} error={errors.name}
                    />
                    <Field
                        label="Contact number" name="phone" type="tel" value={values.phone}
                        onChange={handleChange} onBlur={handleBlur} error={errors.phone}
                    />
                    <Field
                        label="Email" name="email" type="email" value={values.email}
                        onChange={handleChange} onBlur={handleBlur} error={errors.email}
                    />
                    <Field
                        label="City" name="city" value={values.city}
                        onChange={handleChange} onBlur={handleBlur} error={errors.city}
                    />
                    <Field
                        label="Total bays" name="bays" inputMode="numeric" value={values.bays}
                        onChange={handleChange} onBlur={handleBlur} error={errors.bays}
                    />
                    <Field
                        label="Working hours" name="hours" value={values.hours}
                        onChange={handleChange} onBlur={handleBlur} error={errors.hours}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        type="submit" disabled={busy}
                        className="btn-primary px-6 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busy ? 'Saving…' : 'Save changes'}
                    </button>
                    {status === 'success' && (
                        <p role="status" className="text-[0.8125rem] text-primary">Saved to this browser.</p>
                    )}
                    {submitError && (
                        <p role="alert" className="text-[0.8125rem] text-clay-ink">{submitError}</p>
                    )}
                </div>
            </form>

            <fieldset className="panel space-y-4 p-6">
                <legend className="sr-only">System alert preferences</legend>
                <h3 className="border-b border-line pb-3 font-semibold text-ink">System alerts</h3>
                {ALERTS.map(item => (
                    <label key={item.id} className="flex cursor-pointer items-center justify-between gap-4 py-0.5">
                        <span className="text-sm text-ink-soft">{item.label}</span>
                        <span className="relative inline-flex shrink-0">
                            <input
                                type="checkbox"
                                checked={alerts[item.id]}
                                onChange={event => {
                                    const { checked } = event.target;
                                    setAlerts(prev => ({ ...prev, [item.id]: checked }));
                                }}
                                className="peer h-5 w-10 cursor-pointer appearance-none rounded-full bg-sand-deep transition-colors checked:bg-forest-pale"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-faint transition-all peer-checked:left-[1.375rem] peer-checked:bg-primary"
                            />
                        </span>
                    </label>
                ))}
            </fieldset>

            <div className="panel space-y-4 p-6">
                <h3 className="border-b border-line pb-3 font-semibold text-ink">Integrations</h3>
                {INTEGRATIONS.map(item => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-forest-pale">
                                <item.icon size={14} className="text-primary" aria-hidden="true" />
                            </div>
                            <span className="truncate text-sm text-ink-soft">{item.label}</span>
                        </div>
                        <span className={`shrink-0 text-xs font-bold ${item.status === 'Connected' ? 'text-primary' : 'text-clay-ink'}`}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>

            <div className="panel border-clay p-6">
                <h3 className="mb-3 border-b border-line pb-3 font-semibold text-ink">Reset the workshop book</h3>
                <p className="mb-4 text-[0.875rem] leading-relaxed text-muted">
                    Customers, vehicles and bookings are held in this browser rather than on a
                    server. Resetting discards every change made here and restores the seeded
                    records.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        onResetWorkshop();
                        resetStored();
                        resetAlerts();
                        reset();
                        showToast('Workshop data reset.', 'info');
                    }}
                    className="text-sm text-clay-ink transition-colors hover:underline"
                >
                    Reset workshop data
                </button>
            </div>
        </div>
    );
};
