import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Field } from '../ui/Field';
import { StatusBadge } from '../ui/StatusBadge';
import { useForm } from '../../hooks/useForm';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../lib/format';
import { isBlank, isEmail, isPhone } from '../../lib/validation';
import type { FieldErrors } from '../../lib/validation';
import type { Customer } from '../../types/workshop';

interface AccountSettingsProps {
    customer: Customer | undefined;
    visits: number;
    /** Clears the persisted workshop snapshot. */
    onResetWorkshop: () => void;
}

/* ── Profile ───────────────────────────────────────────────── */

interface ProfileValues extends Record<string, string> {
    name: string;
    phone: string;
    email: string;
    city: string;
}

function validateProfile(values: ProfileValues): FieldErrors<ProfileValues> {
    const errors: FieldErrors<ProfileValues> = {};
    if (isBlank(values.name)) errors.name = 'We need a name for the service record.';
    if (isBlank(values.phone)) errors.phone = 'A number we can reach you on.';
    else if (!isPhone(values.phone)) errors.phone = 'That does not look like a phone number.';
    if (isBlank(values.email)) errors.email = 'An address for invoices and confirmations.';
    else if (!isEmail(values.email)) errors.email = 'Check the address — it looks incomplete.';
    if (isBlank(values.city)) errors.city = 'Which city is the vehicle based in?';
    return errors;
}

/* ── Notification preferences ──────────────────────────────── */

const NOTIFICATIONS = [
    { id: 'serviceReminders', label: 'Service reminders by SMS' },
    { id: 'invoiceReceipts', label: 'Invoice receipts by email' },
    { id: 'bookingConfirmations', label: 'Booking confirmations' },
    { id: 'offers', label: 'Offers and seasonal checks' },
] as const;

type NotificationPrefs = Record<(typeof NOTIFICATIONS)[number]['id'], boolean>;

const DEFAULT_PREFS: NotificationPrefs = {
    serviceReminders: true,
    invoiceReceipts: true,
    bookingConfirmations: true,
    offers: false,
};

/**
 * AccountSettings — the owner's own details and preferences.
 *
 * A component rather than part of the dashboard page so the form
 * initialises from the loaded customer record: a `useState` at page
 * level would have captured empty strings during the loading pass and
 * never caught up.
 *
 * Everything here is a per-browser preference, which is why it goes to
 * localStorage rather than through the workshop provider.
 */
export const AccountSettings: React.FC<AccountSettingsProps> = ({
    customer, visits, onResetWorkshop,
}) => {
    const { showToast } = useToast();
    const [prefs, setPrefs, resetPrefs] = usePersistentState<NotificationPrefs>(
        'autosphere.prefs.notifications', DEFAULT_PREFS,
    );
    const [profile, setProfile, resetProfile] = usePersistentState<ProfileValues | null>(
        'autosphere.profile', null,
    );

    const form = useForm<ProfileValues>({
        initialValues: profile ?? {
            name: customer?.name ?? '',
            phone: customer?.phone ?? '',
            email: customer?.email ?? '',
            city: customer?.city ?? '',
        },
        validate: validateProfile,
        onSubmit: useCallback(async (values: ProfileValues) => {
            setProfile(values);
            showToast('Your details were saved.');
        }, [setProfile, showToast]),
    });
    // Destructured at the call site, as the other forms in the project
    // do: the controller is read during render, and reading it through
    // the object it came back in trips the hooks lint rule.
    const {
        values, errors, status, submitError, reset,
        handleChange, handleBlur, handleSubmit, formRef,
    } = form;


    const busy = status === 'submitting';

    return (
        <div className="max-w-2xl space-y-5">
            <h2 className="text-xl font-bold text-ink">Account settings</h2>

            <form ref={formRef} onSubmit={handleSubmit} noValidate className="panel space-y-5 p-6">
                <h3 className="border-b border-line pb-3 font-semibold text-ink">Personal information</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                        label="Full name" name="name" value={values.name}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.name} autoComplete="name"
                    />
                    <Field
                        label="Phone number" name="phone" type="tel" value={values.phone}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.phone} autoComplete="tel"
                    />
                    <Field
                        label="Email" name="email" type="email" value={values.email}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.email} autoComplete="email"
                    />
                    <Field
                        label="City" name="city" value={values.city}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.city} autoComplete="address-level2"
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
                <legend className="sr-only">Notification preferences</legend>
                <h3 className="border-b border-line pb-3 font-semibold text-ink">Notifications</h3>
                {NOTIFICATIONS.map(item => (
                    <label key={item.id} className="flex cursor-pointer items-center justify-between gap-4 py-0.5">
                        <span className="text-sm text-ink-soft">{item.label}</span>
                        {/* A real checkbox, styled as a switch: reachable by Tab
                            and toggled by Space, which a styled div is not. */}
                        <span className="relative inline-flex shrink-0">
                            <input
                                type="checkbox"
                                checked={prefs[item.id]}
                                onChange={event => {
                                    const { checked } = event.target;
                                    setPrefs(prev => ({ ...prev, [item.id]: checked }));
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
                <h3 className="border-b border-line pb-3 font-semibold text-ink">Membership</h3>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="font-bold text-ink">{customer?.plan ?? 'Basic'} plan</p>
                        <p className="mt-0.5 text-xs text-muted">
                            Member since {formatDate(customer?.joinedOn ?? null)} · {visits} completed visits
                        </p>
                    </div>
                    {customer && <StatusBadge status={customer.status} size="sm" />}
                </div>
                <Link to="/contact" className="btn-secondary px-5 py-2 text-sm">
                    Talk to an advisor about your plan
                </Link>
            </div>

            <div className="panel border-clay p-6">
                <h3 className="mb-3 border-b border-line pb-3 font-semibold text-ink">Reset this dashboard</h3>
                <p className="mb-4 text-[0.875rem] leading-relaxed text-muted">
                    This build keeps your garage, bookings and preferences in this browser rather
                    than on a server. Resetting discards every change made here and restores the
                    seeded records.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        onResetWorkshop();
                        resetProfile();
                        resetPrefs();
                        reset();
                        showToast('Dashboard data reset.', 'info');
                    }}
                    className="text-sm text-clay-ink transition-colors hover:underline"
                >
                    Reset dashboard data
                </button>
            </div>
        </div>
    );
};
