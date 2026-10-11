import React from 'react';
import PageHero from '../components/PageHero';
import { Field } from '../components/ui/Field';
import { Accordion } from '../components/ui/Accordion';
import { useForm } from '../hooks/useForm';
import { isBlank, isEmail, isPhone } from '../lib/validation';
import type { FieldErrors } from '../lib/validation';
import {
    Mail, Phone, MapPin, Send, Clock, Headphones,
    AlertTriangle, CheckCircle, Car, Wrench,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────── */

/* Every figure and detail below is one the rest of the site already
   states. The page previously carried a US placeholder phone number, a
   placeholder street address and a third, contradictory set of opening
   hours. The footer is the source of truth for all three. */

const PHONE_DISPLAY = '+91 22 4488 1200';
const PHONE_HREF = 'tel:+912244881200';

const CONTACT_CHANNELS = [
    {
        icon: Phone,
        title: 'Call the centre',
        value: PHONE_DISPLAY,
        sub: 'Mon–Fri 8:30–19:00 · Sat 9:00–17:00',
        cta: 'Call now',
        href: PHONE_HREF,
    },
    {
        icon: Mail,
        title: 'Email us',
        value: 'service@autosphere.tech',
        sub: 'We reply within 2 working hours',
        cta: 'Send an email',
        href: 'mailto:service@autosphere.tech',
    },
    {
        icon: MapPin,
        title: 'Visit the workshop',
        value: 'Plot 14, MIDC Road 2',
        sub: 'Andheri East, Mumbai 400093',
        cta: 'Open in Maps',
        href: 'https://maps.google.com/?q=MIDC+Road+2,+Andheri+East,+Mumbai+400093',
    },
];

const RESPONSE_STATS = [
    { icon: Headphones, stat: '2 hrs', label: 'Typical reply to an email enquiry' },
    { icon: Car, stat: 'Same day', label: 'Usual availability for urgent diagnostics' },
    { icon: Wrench, stat: 'Four', label: 'Service bays on the floor' },
    { icon: Clock, stat: 'Six days', label: 'Open Monday to Saturday' },
];

/* The six service lines the homepage names, plus the two enquiry
   routes the form needs. Nothing here is a service we do not run. */
const SERVICE_OPTIONS = [
    'Diagnostics',
    'Periodic maintenance',
    'Brake service',
    'AC & cooling',
    'Performance & ECU',
    'Detailing',
    'Pre-purchase inspection',
    'Something else',
];

const FAQS = [
    {
        q: 'How quickly can I get a booking?',
        a: 'Most standard services have a slot within 2–3 working days. Urgent diagnostics are usually same-day — call the centre to arrange it rather than using the form.',
    },
    {
        q: 'Do you work on all makes?',
        a: 'Yes. We are an independent multi-brand centre and Bosch-certified, so our scan tools cover the European, Japanese and Indian-market makes we see most. If we cannot diagnose your car properly we will say so rather than guess.',
    },
    {
        q: 'What happens after I submit the contact form?',
        a: 'A service coordinator will review your request and contact you within 2 working hours (Mon–Sat) to confirm your booking details, provide a preliminary quote, and answer any questions.',
    },
    {
        q: 'Do you take on fleet work?',
        a: 'We do take on small fleets under a scheduled-maintenance arrangement. Call the centre and ask for a service advisor — it depends on the size of the fleet and what the vehicles need.',
    },
    {
        q: 'Is there a warranty on repairs and services?',
        a: 'Yes. All work carried out at AutoSphere is covered by a comprehensive warranty on both parts and labour. Specific terms vary by service type — ask your coordinator for details.',
    },
    {
        q: 'Can I wait while the work is done?',
        a: 'Yes. There is a waiting area with Wi-Fi and coffee. For anything longer than a couple of hours we will usually suggest you leave the car with us and we will call when it is ready.',
    },
];

/* ─── Service request form ───────────────────────────────── */

interface ServiceRequest {
    name: string;
    email: string;
    phone: string;
    vehicle: string;
    service: string;
    message: string;
    [key: string]: string;
}

const EMPTY_REQUEST: ServiceRequest = {
    name: '', email: '', phone: '', vehicle: '', service: SERVICE_OPTIONS[0], message: '',
};

function validateRequest(v: ServiceRequest): FieldErrors<ServiceRequest> {
    const errors: FieldErrors<ServiceRequest> = {};
    if (isBlank(v.name)) errors.name = 'Please tell us your name.';
    if (isBlank(v.email)) errors.email = 'We need an email address to reply to.';
    else if (!isEmail(v.email)) errors.email = 'That does not look like a valid email address.';
    if (!isBlank(v.phone) && !isPhone(v.phone)) errors.phone = 'Enter a phone number we can reach you on, or leave this blank.';
    if (isBlank(v.vehicle)) errors.vehicle = 'Tell us the make and model so we can quote accurately.';
    if (isBlank(v.message)) errors.message = 'Describe the problem or the service you need.';
    else if (v.message.trim().length < 15) errors.message = 'A little more detail helps us prepare — 15 characters or more.';
    return errors;
}

const ServiceRequestForm: React.FC = () => {
    const form = useForm<ServiceRequest>({
        initialValues: EMPTY_REQUEST,
        validate: validateRequest,
        onSubmit: async () => {
            // No backend yet: this stands in for POST /api/service-requests
            // so the component already handles latency and failure.
            await new Promise<void>((resolve, reject) => {
                setTimeout(() => (Math.random() < 0.12
                    ? reject(new Error('We could not send your request just now. Please try again, or call the centre.'))
                    : resolve()), 900);
            });
        },
    });

    const { values, errors, status, submitError, handleChange, handleBlur, handleSubmit, reset, formRef } = form;
    const busy = status === 'submitting';

    if (status === 'success') {
        return (
            <div className="panel border-line p-6 sm:p-10" role="status">
                <CheckCircle size={28} className="text-forest" aria-hidden="true" />
                <h3 className="title-lg mt-4">Request received</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    Thank you, {values.name.split(' ')[0]}. A service advisor will reply to{' '}
                    <span className="text-ink">{values.email}</span> within two working hours,
                    Monday to Saturday.
                </p>
                <button onClick={reset} className="btn btn-outline mt-6">
                    Send another request
                </button>
            </div>
        );
    }

    return (
        <div className="panel p-6 sm:p-10 border-line">
            <h3 className="title-lg mb-7">Send a request</h3>
            <form ref={formRef} className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Full name" name="name" autoComplete="name"
                        value={values.name} onChange={handleChange} onBlur={handleBlur}
                        error={errors.name} disabled={busy}
                    />
                    <Field
                        label="Email address" name="email" type="email" autoComplete="email"
                        value={values.email} onChange={handleChange} onBlur={handleBlur}
                        error={errors.email} disabled={busy}
                    />
                </div>

                <Field
                    label="Phone number" name="phone" type="tel" autoComplete="tel" optional
                    value={values.phone} onChange={handleChange} onBlur={handleBlur}
                    error={errors.phone} disabled={busy}
                    hint="Useful if we need to ask a quick question about the fault."
                />

                <Field
                    label="Vehicle make and model" name="vehicle"
                    value={values.vehicle} onChange={handleChange} onBlur={handleBlur}
                    error={errors.vehicle} disabled={busy}
                    hint="For example: BMW 320d, 2019"
                />

                <Field as="select" label="Service type" name="service"
                    value={values.service} onChange={handleChange} onBlur={handleBlur} disabled={busy}>
                    {SERVICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Field>

                <Field as="textarea" label="What is it doing?" name="message" rows={4}
                    value={values.message} onChange={handleChange} onBlur={handleBlur}
                    error={errors.message} disabled={busy}
                    hint="The noise, when it happens, and what it feels like." />

                {submitError && (
                    <p role="alert" className="border-l-2 border-clay bg-clay-pale px-4 py-3 text-[0.875rem] text-ink">
                        {submitError}
                    </p>
                )}

                <button type="submit" disabled={busy} className="btn btn-solid w-full disabled:cursor-not-allowed disabled:opacity-60">
                    {busy ? 'Sending…' : <>Send request <Send size={16} aria-hidden="true" /></>}
                </button>

                <p className="text-center text-[0.8125rem] text-muted">
                    We reply within 2 working hours · Mon–Sat
                </p>
            </form>
        </div>
    );
};

const Contact: React.FC = () => {
    return (
        <div className="pb-32">
            <PageHero
                badge="Contact"
                title="Talk to a service advisor"
                subtitle="Tell us what the car is doing and we will tell you what it needs, what it will cost, and when we can take it in."
                breadcrumb={['Home', 'Contact']}
            />

            {/* ── Emergency Banner ── */}
            <section className="wrap mb-20">
                <div className="panel flex flex-col items-start gap-5 border-clay bg-clay-pale p-6 sm:flex-row sm:items-center sm:gap-6">
                    {/* The tile here was bg-clay-pale on a bg-clay-pale
                        banner, so the icon sat on an invisible square. */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-clay text-paper">
                        <AlertTriangle size={20} aria-hidden="true" />
                    </div>
                    <div>
                        <p className="title-sm">Car off the road right now?</p>
                        <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                            Call the centre rather than using the form. If we can get to
                            it the same day, we will tell you on the phone.
                        </p>
                    </div>
                    <a href={PHONE_HREF} className="btn btn-clay shrink-0 px-5 py-2.5 text-[0.875rem] sm:ml-auto">
                        {PHONE_DISPLAY}
                    </a>
                </div>
            </section>

            {/* ── Contact Channels ── */}
            <section className="wrap mb-24">
                <h2 className="display-md border-b border-ink pb-6">Three ways to reach us</h2>

                {/* Three real channels. The fourth was a live chat with a
                    technician behind an href="#", and a "Get Directions"
                    link that also went nowhere. */}
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {CONTACT_CHANNELS.map(ch => (
                        <div key={ch.title} className="panel flex flex-col p-7 transition-colors hover:border-forest">
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-sm bg-forest-pale">
                                <ch.icon size={20} className="text-forest" aria-hidden="true" />
                            </div>
                            <p className="title-sm">{ch.title}</p>
                            <p className="mt-1.5 text-[0.9375rem] font-medium text-ink-soft">{ch.value}</p>
                            <p className="mt-1 text-[0.8125rem] text-muted">{ch.sub}</p>
                            <a
                                href={ch.href}
                                {...(ch.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className="btn btn-outline mt-6 self-start px-5 py-2.5 text-[0.875rem]"
                            >
                                {ch.cta}
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Response Stats ── */}
            <section className="wrap mb-24">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {RESPONSE_STATS.map(item => (
                        <div key={item.label} className="panel flex flex-col p-6">
                            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-sm bg-forest-pale">
                                <item.icon size={17} className="text-forest" aria-hidden="true" />
                            </div>
                            <dd className="stat text-[1.625rem]">{item.stat}</dd>
                            <dt className="mt-2 text-[0.8125rem] leading-snug text-muted">{item.label}</dt>
                        </div>
                    ))}
                </dl>
            </section>

            {/* ── Form + Hours ── */}
            <section className="wrap mb-24">
                <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">

                    {/* Left — hours and the service lines */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="display-md">Every enquiry reaches a technician</h2>
                            <p className="lede mt-5">
                                Not a call centre. Describe the symptom in your own words and
                                a service advisor reads it before replying — so the first
                                answer you get is about your car, not a price list.
                            </p>
                        </div>

                        {/* Hours — the same figures as the footer. This panel
                            previously said 08:00–20:00 and "Sunday: emergency
                            only", which the footer contradicts. */}
                        <div className="panel-sand p-6 sm:p-8">
                            <div className="mb-5 flex items-center gap-3">
                                <Clock size={18} className="text-forest" aria-hidden="true" />
                                <h3 className="title-sm">Opening hours</h3>
                            </div>
                            <dl className="text-[0.9375rem]">
                                {[
                                    { day: 'Monday–Friday', hours: '8:30–19:00' },
                                    { day: 'Saturday', hours: '9:00–17:00' },
                                    { day: 'Sunday', hours: 'Closed' },
                                ].map(row => (
                                    <div key={row.day} className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-0">
                                        <dt className="text-muted">{row.day}</dt>
                                        <dd className="font-medium tabular-nums text-ink-soft">{row.hours}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* The six service lines, as plain text. These were four
                            tiles with cursor-pointer and no click handler. */}
                        <div>
                            <h3 className="title-sm">What we take on</h3>
                            <ul className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                                {['Diagnostics', 'Periodic maintenance', 'Brake service',
                                    'AC & cooling', 'Performance & ECU', 'Detailing'].map(label => (
                                    <li key={label} className="flex items-center gap-2.5 border-b border-line-soft py-2.5 text-[0.9375rem] text-ink-soft">
                                        <Wrench size={14} className="shrink-0 text-forest" aria-hidden="true" />
                                        {label}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
                                We do not take on bodywork or insurance claims.
                            </p>
                        </div>
                    </div>

                    {/* Right — form */}
                    <ServiceRequestForm />
                </div>
            </section>

            {/* ── FAQ ── */}
            {/* wrap-tight, not a third container width on one page */}
            <section className="wrap-tight">
                <h2 className="display-md border-b border-ink pb-6">Common questions</h2>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
                    Not covered here? Call the centre on{' '}
                    <a
                        href={PHONE_HREF}
                        className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-clay-ink hover:decoration-clay"
                    >
                        {PHONE_DISPLAY}
                    </a>
                    {' '}and ask for a service advisor.
                </p>
                <Accordion items={FAQS} className="mt-8" defaultOpen={0} />
            </section>
        </div>
    );
};

export default Contact;
