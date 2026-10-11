import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer — editorial and light. A brand statement carries the left
 * rail; link columns sit on the right. Separated by rules, not a
 * block of dark colour.
 */

const COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
    {
        heading: 'Services',
        links: [
            { label: 'Diagnostics', to: '/contact' },
            { label: 'Performance & ECU', to: '/contact' },
            { label: 'Brake service', to: '/contact' },
            { label: 'AC & cooling', to: '/contact' },
            { label: 'Periodic maintenance', to: '/contact' },
            { label: 'Detailing', to: '/contact' },
        ],
    },
    {
        heading: 'Company',
        links: [
            { label: 'About us', to: '/about' },
            { label: 'Our technicians', to: '/technicians' },
            { label: 'Certifications', to: '/certifications' },
            { label: 'Careers', to: '/careers' },
        ],
    },
    {
        heading: 'Support',
        links: [
            { label: 'Book a service', to: '/contact' },
            { label: 'Your account', to: '/user-dashboard' },
            { label: 'Vehicle showcase', to: '/inventory' },
            { label: 'Contact', to: '/contact' },
        ],
    },
];

/** External profiles open in a new tab; rel guards against tab-nabbing. */
const SOCIAL = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
];

const LEGAL = [
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
    { label: 'Cookies', to: '/cookies' },
];

const Footer: React.FC = () => (
    <footer className="border-t border-line bg-paper">
        <div className="wrap">

            {/* Upper — statement and links */}
            {/* Two columns from 640px and three from 768px: a single
                stack held until 1024px, which left the tablet footer
                needlessly tall beside a wide empty margin. */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-11 py-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10 lg:py-20">

                <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
                    <Link
                        to="/"
                        className="inline-flex items-baseline gap-[3px] font-display text-[1.75rem] font-normal leading-none tracking-[-0.01em] text-ink"
                    >
                        AutoSphere
                        <span className="text-clay-ink" aria-hidden="true">.</span>
                    </Link>
                    <p className="mt-4 max-w-[26rem] text-[0.9375rem] leading-relaxed text-muted">
                        An independent service centre in Mumbai. We diagnose before we
                        quote, name the parts we fit, and keep the record of every job
                        in your account.
                    </p>

                    <address className="mt-7 not-italic">
                        <p className="spec-label">Service centre</p>
                        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                            Plot 14, MIDC Road 2<br />
                            Andheri East, Mumbai 400093
                        </p>
                        <a
                            href="tel:+912244881200"
                            className="mt-2 inline-block text-[0.9375rem] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-clay-ink hover:decoration-clay"
                        >
                            +91 22 4488 1200
                        </a>
                    </address>
                </div>

                {COLUMNS.map(column => (
                    <nav key={column.heading} aria-label={column.heading} className="lg:col-span-2">
                        <h2 className="label">{column.heading}</h2>
                        <ul className="mt-4 space-y-2.5">
                            {column.links.map(link => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-[0.9375rem] text-ink-soft transition-colors hover:text-clay-ink"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}

                <div className="sm:col-span-2 md:col-span-1 lg:col-span-2">
                    <h2 className="label">Opening hours</h2>
                    <dl className="mt-4 space-y-2.5 text-[0.9375rem]">
                        <div className="flex justify-between gap-3">
                            <dt className="text-muted">Mon–Fri</dt>
                            <dd className="text-ink-soft">8:30–19:00</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-muted">Saturday</dt>
                            <dd className="text-ink-soft">9:00–17:00</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-muted">Sunday</dt>
                            <dd className="text-muted">Closed</dd>
                        </div>
                    </dl>

                    <h2 className="label mt-7">Follow</h2>
                    <ul className="mt-3 flex gap-4 lg:flex-col lg:gap-2.5">
                        {SOCIAL.map(item => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[0.9375rem] text-ink-soft transition-colors hover:text-clay-ink"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Lower — legal */}
            <div className="flex flex-col gap-3 border-t border-line py-6 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} AutoSphere Automotive Services LLP</p>
                <ul className="flex gap-6">
                    {LEGAL.map(item => (
                        <li key={item.label}>
                            <Link to={item.to} className="transition-colors hover:text-ink">{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </footer>
);

export default Footer;
