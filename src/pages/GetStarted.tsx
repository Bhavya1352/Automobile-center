import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Eye, EyeOff, ArrowRight, ArrowLeft,
    FileText, Bell, ShieldCheck,
} from 'lucide-react';
import { Field } from '../components/ui/Field';
import { useForm } from '../hooks/useForm';
import { isBlank, isEmail, passwordScore, PASSWORD_LABELS } from '../lib/validation';
import type { FieldErrors } from '../lib/validation';

/* What an account actually does, in the voice the homepage uses. The
   three entries here were "Instant Calibration", "Guardian Protocol"
   and "Master Access" — none of which the product has. The `color`
   field on each was never read. */
const FEATURES = [
    {
        icon: FileText,
        title: 'Every job on record',
        desc: 'What we measured, the parts we fitted and the invoice, kept against the car.',
    },
    {
        icon: Bell,
        title: 'Intervals you can see',
        desc: 'Odometer, next service and insurance dates in one place, so nothing lapses quietly.',
    },
    {
        icon: ShieldCheck,
        title: 'The AI vehicle check',
        desc: 'Describe a symptom in your own words and get a view on what it is likely to be.',
    },
];

interface SignUp {
    name: string;
    vehicle: string;
    email: string;
    password: string;
    agree: boolean;
    [key: string]: string | boolean;
}

const EMPTY_SIGNUP: SignUp = { name: '', vehicle: '', email: '', password: '', agree: false };

const MIN_PASSWORD_SCORE = 3;

function validateSignUp(v: SignUp): FieldErrors<SignUp> {
    const errors: FieldErrors<SignUp> = {};
    if (isBlank(v.name)) errors.name = 'Please enter your name.';
    if (isBlank(v.vehicle)) errors.vehicle = 'Which vehicle are you registering?';
    if (isBlank(v.email)) errors.email = 'An email address is required.';
    else if (!isEmail(v.email)) errors.email = 'That does not look like a valid email address.';
    if (isBlank(v.password)) errors.password = 'Choose a password.';
    else if (v.password.length < 8) errors.password = 'Use at least 8 characters.';
    else if (passwordScore(v.password) < MIN_PASSWORD_SCORE) {
        errors.password = 'Add a capital letter, a number or a symbol to strengthen this.';
    }
    if (!v.agree) errors.agree = 'Please accept the terms to continue.';
    return errors;
}

const GetStarted: React.FC = () => {
    const [showPass, setShowPass] = useState(false);

    const form = useForm<SignUp>({
        initialValues: EMPTY_SIGNUP,
        validate: validateSignUp,
        onSubmit: async () => {
            // Stands in for POST /api/auth/register until there is a backend.
            await new Promise<void>(resolve => setTimeout(resolve, 1000));
        },
    });
    const { values, errors, status, handleChange, handleBlur, handleSubmit, setValue, formRef } = form;
    const busy = status === 'submitting';
    const score = passwordScore(values.password);

    return (
        <div className="flex items-center justify-center bg-paper px-5 py-14 sm:py-20">
            {/* The two blurred orbs that sat behind this card were the last
                of the glow the redesign removed, and one of them pulsed
                forever. */}
            <div className="w-full max-w-5xl">
                <Link to="/" className="mb-6 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-muted transition-colors hover:text-ink">
                    <ArrowLeft size={15} aria-hidden="true" />
                    Back to home
                </Link>

                <div className="panel grid overflow-hidden border-line lg:grid-cols-[1fr_400px]">
                {/* ── LEFT: FORM PANEL ─────────────────────────────── */}
                <div className="p-6 sm:p-8 lg:p-14">
                    <Link
                        to="/"
                        className="mb-10 inline-flex items-baseline gap-[3px] font-display text-[1.5rem] font-normal leading-none tracking-[-0.01em] text-ink"
                    >
                        AutoSphere<span className="text-clay-ink" aria-hidden="true">.</span>
                    </Link>

                    <div className="mb-10">
                        <h1 className="display-md">Create your account</h1>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                            Keep your service history, invoices and upcoming work in one place.
                        </p>
                    </div>

                    {status === 'success' && (
                        <div role="status" className="mb-6 border-l-2 border-forest bg-forest-pale px-4 py-3">
                            <p className="text-[0.9375rem] font-semibold text-forest">Account created</p>
                            <p className="mt-0.5 text-[0.875rem] text-ink-soft">
                                Check your inbox to verify your email address.
                            </p>
                        </div>
                    )}

                    <form ref={formRef} className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Full name" name="name" autoComplete="name"
                                value={values.name} onChange={handleChange} onBlur={handleBlur}
                                error={errors.name} disabled={busy}
                            />
                            <Field
                                label="Vehicle" name="vehicle" autoComplete="off"
                                value={values.vehicle} onChange={handleChange} onBlur={handleBlur}
                                error={errors.vehicle} disabled={busy}
                            />
                        </div>

                        <Field
                            label="Email address" name="email" type="email" autoComplete="email"
                            value={values.email} onChange={handleChange} onBlur={handleBlur}
                            error={errors.email} disabled={busy}
                        />

                        <div className="relative">
                            <Field
                                label="Password" name="password"
                                type={showPass ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={values.password} onChange={handleChange} onBlur={handleBlur}
                                error={errors.password} disabled={busy}
                                className="[&_input]:pr-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                aria-pressed={showPass}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                                className="absolute right-3 top-[2.1rem] text-muted transition-colors hover:text-ink"
                            >
                                {showPass ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                            </button>
                        </div>

                        {values.password && (
                            <div className="space-y-1.5">
                                <div className="flex h-1 gap-1.5" aria-hidden="true">
                                    {[1, 2, 3, 4].map(step => (
                                        <div
                                            key={step}
                                            className={`flex-1 rounded-full transition-colors ${score >= step ? 'bg-forest' : 'bg-sand-deep'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-[0.75rem] text-muted" aria-live="polite">
                                    Password strength:{' '}
                                    <span className={score >= MIN_PASSWORD_SCORE ? 'font-semibold text-forest' : 'font-semibold text-ink-soft'}>
                                        {PASSWORD_LABELS[score - 1] ?? 'Too short'}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="agree"
                                    checked={values.agree}
                                    onChange={e => setValue('agree', e.target.checked)}
                                    onBlur={handleBlur}
                                    aria-invalid={errors.agree ? true : undefined}
                                    aria-describedby={errors.agree ? 'agree-error' : undefined}
                                    className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
                                />
                                <span className="text-[0.8125rem] leading-relaxed text-muted">
                                    I accept the service terms and privacy policy.
                                </span>
                            </label>
                            {errors.agree && (
                                <p id="agree-error" role="alert" className="mt-1.5 text-[0.8125rem] text-clay-ink">
                                    {errors.agree}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={busy}
                            className="btn btn-solid w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {busy ? 'Creating your account…' : <>Create account <ArrowRight size={16} aria-hidden="true" /></>}
                        </button>

                        <p className="text-center text-[0.8125rem] text-muted">
                            Already registered?{' '}
                            <Link to="/user-dashboard" className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:text-clay-ink">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>

                {/* ── RIGHT: INFO PANEL ────────────────────────────── */}
                <div className="hidden flex-col justify-between border-l border-paper/15 bg-forest p-12 lg:flex">
                    <div>
                        <p className="spec-label text-paper/75">Your account</p>

                        <h2 className="display-md mt-3 text-paper">
                            The record stays with the car
                        </h2>

                        <ul className="mt-9 space-y-8">
                            {FEATURES.map(f => (
                                <li key={f.title} className="flex gap-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-paper/15">
                                        <f.icon className="text-paper" size={18} aria-hidden="true" />
                                    </span>
                                    <span>
                                        <span className="block text-[0.9375rem] font-semibold text-paper">{f.title}</span>
                                        <span className="mt-1 block text-[0.8125rem] leading-relaxed text-paper/75">{f.desc}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* A fabricated 4.2k-owner count, three initialled avatars,
                        five filled stars and an invented quote stood here. */}
                    <p className="border-t border-paper/15 pt-6 text-[0.8125rem] leading-relaxed text-paper/75">
                        An account is free and takes a minute. It is the same record the
                        workshop writes to, so nothing has to be re-entered when you book.
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
