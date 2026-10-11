import React, { useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { useWorkshop } from '../../hooks/useWorkshop';
import { isBlank, isEmail, isPhone } from '../../lib/validation';
import type { FieldErrors } from '../../lib/validation';
import type { Customer, CustomerDraft } from '../../types/workshop';

interface CustomerFormDialogProps {
    open: boolean;
    onClose: () => void;
    /** Present for an edit, absent for a new record. */
    customer?: Customer | null;
}

const EMPTY: CustomerDraft = { name: '', email: '', phone: '', city: '', plan: 'Basic' };

function validate(values: CustomerDraft): FieldErrors<CustomerDraft> {
    const errors: FieldErrors<CustomerDraft> = {};
    if (isBlank(values.name)) errors.name = 'Enter the customer’s name.';
    if (isBlank(values.email)) errors.email = 'An address for invoices and confirmations.';
    else if (!isEmail(values.email)) errors.email = 'Check the address — it looks incomplete.';
    if (isBlank(values.phone)) errors.phone = 'A number the workshop can reach them on.';
    else if (!isPhone(values.phone)) errors.phone = 'That does not look like a phone number.';
    if (isBlank(values.city)) errors.city = 'Which city is the vehicle based in?';
    return errors;
}

/**
 * CustomerFormDialog — opens a customer record, or corrects one.
 *
 * Email uniqueness is enforced by the provider rather than here, for
 * the same reason the vehicle form leaves registration to it: this
 * form cannot know what is already on the book.
 */
export const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
    open, onClose, customer,
}) => {
    const { addCustomer, updateCustomer } = useWorkshop();
    const { showToast } = useToast();
    const editing = Boolean(customer);

    const initialValues = useMemo<CustomerDraft>(() => (customer ? {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        plan: customer.plan,
    } : EMPTY), [customer]);

    const onSubmit = useCallback(async (draft: CustomerDraft) => {
        if (customer) {
            await updateCustomer(customer.id, draft);
            showToast(`${draft.name}’s details updated.`);
        } else {
            await addCustomer(draft);
            showToast(`${draft.name} added to the customer book.`);
        }
        onClose();
    }, [customer, updateCustomer, addCustomer, showToast, onClose]);

    const form = useForm<CustomerDraft>({ initialValues, validate, onSubmit });
    const {
        values, errors, status, submitError,
        handleChange, handleBlur, handleSubmit, formRef,
    } = form;
    const busy = status === 'submitting';

    return (
        <Modal
            open={open}
            onClose={onClose}
            busy={busy}
            title={editing ? `Edit ${customer?.name}` : 'Add a customer'}
            description={editing
                ? 'Changes apply to the workshop book held in this browser.'
                : 'Opening a record lets you book work against it straight away.'}
            footer={
                <>
                    <button
                        type="button" onClick={onClose} disabled={busy}
                        className="btn-secondary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" form="customer-form" disabled={busy}
                        className="btn-primary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                        {busy ? 'Saving…' : editing ? 'Save changes' : 'Add customer'}
                    </button>
                </>
            }
        >
            <form id="customer-form" ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                {submitError && (
                    <p role="alert" className="border border-clay bg-clay-pale px-4 py-3 text-[0.875rem] text-clay-ink">
                        {submitError}
                    </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Full name" name="name" value={values.name}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.name} autoComplete="off" placeholder="Aarav Sharma"
                        className="sm:col-span-2"
                    />
                    <Field
                        label="Email" name="email" type="email" value={values.email}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.email} autoComplete="off"
                    />
                    <Field
                        label="Phone" name="phone" type="tel" value={values.phone}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.phone} autoComplete="off" placeholder="+91 98201 44120"
                    />
                    <Field
                        label="City" name="city" value={values.city}
                        onChange={handleChange} onBlur={handleBlur}
                        error={errors.city} autoComplete="off" placeholder="Mumbai"
                    />
                    <Field
                        as="select" label="Plan" name="plan" value={values.plan}
                        onChange={handleChange} onBlur={handleBlur} error={errors.plan}
                    >
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                    </Field>
                </div>
            </form>
        </Modal>
    );
};
