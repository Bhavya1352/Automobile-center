import React, { useCallback, useMemo, useState } from 'react';
import {
    Users, LayoutDashboard, Settings, Wrench, BarChart3, Bell,
    Search, UserPlus, Download, FileText, Car,
    CheckCircle2, Star, ChevronRight, XCircle, SearchX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { DashboardTabs } from '../components/dashboard/DashboardTabs';
import { StatCard } from '../components/dashboard/StatCard';
import { BookingStatusSelect } from '../components/dashboard/BookingStatusSelect';
import { JobUpdateDialog } from '../components/dashboard/JobUpdateDialog';
import { CustomerDetailsDialog } from '../components/dashboard/CustomerDetailsDialog';
import { CustomerFormDialog } from '../components/dashboard/CustomerFormDialog';
import { BookingFormDialog } from '../components/dashboard/BookingFormDialog';
import { WorkshopSettings } from '../components/dashboard/WorkshopSettings';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState, ErrorState, LoadingState, Skeleton } from '../components/ui/DataState';

import { useWorkshop, vehicleLabel } from '../hooks/useWorkshop';
import { useTabParam, dashboardPanelProps } from '../hooks/useTabParam';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

import {
    DONUT_CIRCUMFERENCE, DONUT_RADIUS, monthlyTotals, shareByService,
    sparklinePath, technicianWorkload,
} from '../lib/analytics';
import { downloadCsv } from '../lib/csv';
import {
    formatDate, formatKm, formatRelativeDay, formatRupees, formatRupeesCompact,
} from '../lib/format';
import { BAYS } from '../data/workshopData';
import type { Booking, BookingStatus, Customer } from '../types/workshop';

/* ─── Tabs ──────────────────────────────────────────────── */

const tabs = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Users, label: 'Customers' },
    { icon: Wrench, label: 'Technicians' },
    { icon: BarChart3, label: 'Revenue' },
    { icon: Car, label: 'Workshop Floor' },
    { icon: Settings, label: 'Settings' },
] as const;

const TAB_LABELS = tabs.map(t => t.label);

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

/** Jobs that are still the workshop's problem. */
const OPEN_STATUSES: readonly BookingStatus[] = ['Pending', 'Confirmed', 'In Service'];

type Dialog =
    | { kind: 'none' }
    | { kind: 'job'; booking: Booking }
    | { kind: 'customer-details'; customer: Customer }
    | { kind: 'customer-form'; customer: Customer | null }
    | { kind: 'customer-remove'; customer: Customer }
    | { kind: 'booking-form'; customerId?: string };

const CLOSED: Dialog = { kind: 'none' };

/** Floor filter on the workshop tab. */
type FloorFilter = 'All' | BookingStatus;

/* ─── Component ─────────────────────────────────────────── */

const AdminDashboard: React.FC = () => {
    useDocumentTitle('Workshop admin');

    const {
        status, error, reload, customers, vehicles, bookings, records,
        removeCustomer, resetWorkshop,
    } = useWorkshop();
    const { showToast } = useToast();

    const [tab, setTab] = useTabParam(TAB_LABELS);
    const [dialog, setDialog] = useState<Dialog>(CLOSED);
    const close = useCallback(() => setDialog(CLOSED), []);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 250);
    const [floorFilter, setFloorFilter] = useState<FloorFilter>('All');

    /* ── Derived ──────────────────────────────────────────── */

    const openJobs = useMemo(
        () => bookings
            .filter(b => OPEN_STATUSES.includes(b.status))
            .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)),
        [bookings],
    );

    const inService = useMemo(
        () => bookings.filter(b => b.status === 'In Service'),
        [bookings],
    );

    const months = useMemo(() => monthlyTotals(records, 6), [records]);
    const thisMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    const spark = useMemo(() => sparklinePath(months.map(m => m.total)), [months]);
    const revenueMix = useMemo(() => shareByService(records, 3), [records]);
    const workload = useMemo(() => technicianWorkload(records, bookings), [records, bookings]);

    const topServices = useMemo(() => {
        const shares = shareByService(records, 12);
        const busiest = shares[0]?.total ?? 0;
        return shares.slice(0, 5).map(share => ({
            ...share,
            bar: busiest === 0 ? 0 : Math.round((share.total / busiest) * 100),
        }));
    }, [records]);

    const averageRating = useMemo(() => {
        const rated = records.filter(r => r.rating !== null);
        return rated.length
            ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
            : null;
    }, [records]);

    /** Which bay holds what, derived from the jobs rather than typed in. */
    const bayStatus = useMemo(() => BAYS.map(bay => {
        const job = inService.find(b => b.bay === bay)
            ?? openJobs.find(b => b.bay === bay);
        return { bay, job };
    }), [inService, openJobs]);

    /** The workshop's recent movements, newest first. */
    const activity = useMemo(() => {
        const entries = [
            ...records.map(record => ({
                id: `rec-${record.id}`,
                date: record.completedOn,
                icon: CheckCircle2,
                tone: 'success' as const,
                text: `${record.serviceName} completed — ${customers.find(c => c.id === record.customerId)?.name ?? 'customer'} · ${formatRupees(record.cost)}`,
            })),
            ...bookings.map(booking => ({
                id: `bk-${booking.id}`,
                date: booking.scheduledFor,
                icon: booking.status === 'Cancelled' ? XCircle
                    : booking.status === 'In Service' ? Wrench : UserPlus,
                tone: booking.status === 'Cancelled' ? 'warn' as const : 'info' as const,
                text: `${booking.id} ${booking.status.toLowerCase()} — ${customers.find(c => c.id === booking.customerId)?.name ?? 'customer'} · ${booking.serviceName}`,
            })),
        ];
        return entries
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 7);
    }, [records, bookings, customers]);

    /**
     * Customer search across the whole account, not just the name
     * column: an advisor with a plate or a service in mind should not
     * have to know whose car it is.
     */
    const searchIndex = useMemo(() => {
        const index = new Map<string, string>();
        for (const customer of customers) {
            const theirVehicles = vehicles.filter(v => v.ownerId === customer.id);
            const theirServices = [
                ...bookings.filter(b => b.customerId === customer.id).map(b => b.serviceName),
                ...records.filter(r => r.customerId === customer.id).map(r => r.serviceName),
            ];
            index.set(customer.id, [
                customer.name, customer.email, customer.phone, customer.city, customer.plan,
                ...theirVehicles.flatMap(v => [v.make, v.model, v.variant ?? '', v.registration, String(v.year), v.fuel]),
                ...theirServices,
            ].join(' ').toLowerCase());
        }
        return index;
    }, [customers, vehicles, bookings, records]);

    const query = debouncedSearch.trim().toLowerCase();

    const visibleCustomers = useMemo(() => {
        if (!query) return customers;
        // Every whitespace-separated term has to match, so "aarav brake"
        // narrows rather than widening to everything brake-related.
        const terms = query.split(/\s+/);
        return customers.filter(customer => {
            const haystack = searchIndex.get(customer.id) ?? '';
            return terms.every(term => haystack.includes(term));
        });
    }, [customers, query, searchIndex]);

    const floorJobs = useMemo(
        () => (floorFilter === 'All'
            ? openJobs
            : openJobs.filter(b => b.status === floorFilter)),
        [openJobs, floorFilter],
    );

    /* ── Actions ──────────────────────────────────────────── */

    const confirmRemoveCustomer = useCallback(async (customer: Customer) => {
        await removeCustomer(customer.id);
        showToast(`${customer.name} removed from the customer book.`);
    }, [removeCustomer, showToast]);

    const exportCustomers = useCallback(() => {
        if (visibleCustomers.length === 0) {
            showToast('There are no customers to export.', 'info');
            return;
        }
        const ok = downloadCsv(
            'autosphere-customers.csv',
            visibleCustomers.map(customer => {
                const theirRecords = records.filter(r => r.customerId === customer.id);
                return {
                    Name: customer.name,
                    Email: customer.email,
                    Phone: customer.phone,
                    City: customer.city,
                    Plan: customer.plan,
                    Status: customer.status,
                    Vehicles: vehicles.filter(v => v.ownerId === customer.id)
                        .map(v => `${vehicleLabel(v)} (${v.registration})`).join('; '),
                    Visits: theirRecords.length,
                    'Total spend (INR)': theirRecords.reduce((sum, r) => sum + r.cost, 0),
                };
            }),
            ['Name', 'Email', 'Phone', 'City', 'Plan', 'Status', 'Vehicles', 'Visits', 'Total spend (INR)'],
        );
        showToast(
            ok ? `${visibleCustomers.length} customers exported.` : 'The download could not be started.',
            ok ? 'success' : 'error',
        );
    }, [visibleCustomers, vehicles, records, showToast]);

    const exportBookings = useCallback(() => {
        if (bookings.length === 0) {
            showToast('There are no bookings to export.', 'info');
            return;
        }
        const ok = downloadCsv(
            'autosphere-bookings.csv',
            bookings.map(booking => ({
                Reference: booking.id,
                Customer: customers.find(c => c.id === booking.customerId)?.name ?? '',
                Vehicle: vehicleLabel(vehicles.find(v => v.id === booking.vehicleId)),
                Service: booking.serviceName,
                Date: booking.scheduledFor,
                Slot: booking.slot,
                Bay: booking.bay ?? '',
                Technician: booking.technician ?? '',
                Status: booking.status,
                'Estimate (INR)': booking.estimate,
            })),
            ['Reference', 'Customer', 'Vehicle', 'Service', 'Date', 'Slot', 'Bay',
                'Technician', 'Status', 'Estimate (INR)'],
        );
        showToast(
            ok ? `${bookings.length} bookings exported.` : 'The download could not be started.',
            ok ? 'success' : 'error',
        );
    }, [bookings, customers, vehicles, showToast]);

    const exportRevenue = useCallback(() => {
        const ok = downloadCsv(
            'autosphere-revenue.csv',
            months.map(month => ({
                Month: month.key,
                'Revenue (INR)': month.total,
                Jobs: month.count,
                'Average per job (INR)': month.count === 0 ? 0 : Math.round(month.total / month.count),
            })),
            ['Month', 'Revenue (INR)', 'Jobs', 'Average per job (INR)'],
        );
        showToast(
            ok ? 'Revenue report exported.' : 'The download could not be started.',
            ok ? 'success' : 'error',
        );
    }, [months, showToast]);

    /* ── Loading and failure ──────────────────────────────── */

    if (status === 'loading') {
        return (
            <div className="bg-paper">
                <DashboardTabs tabs={tabs} active={tab} onChange={setTab} idPrefix="admin" />
                <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
                    <LoadingState label="Loading the workshop book…" />
                    <Skeleton rows={4} />
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="bg-paper">
                <DashboardTabs tabs={tabs} active={tab} onChange={setTab} idPrefix="admin" />
                <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
                    <ErrorState
                        message={error ?? 'The workshop book could not be loaded.'}
                        onRetry={reload}
                    />
                </div>
            </div>
        );
    }

    /* ── Sections ─────────────────────────────────────────── */

    const renderOverview = () => {
        const growth = previousMonth && previousMonth.total > 0
            ? Math.round(((thisMonth.total - previousMonth.total) / previousMonth.total) * 100)
            : null;

        return (
            <motion.div key="overview" {...fade} className="space-y-6">
                {/* Banner — flat sand on a hairline, matching every panel */}
                <div className="flex flex-col justify-between gap-4 rounded-sm border border-line bg-sand p-6 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-clay-pale px-2 py-0.5 text-xs font-bold text-clay-ink">
                                Admin access
                            </span>
                            <span className="text-xs text-muted">
                                · Workshop command · {formatDate(new Date().toISOString())}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-ink">Welcome, Administrator</h1>
                        <p className="mt-1 text-sm text-muted">
                            {inService.length} vehicle{inService.length === 1 ? '' : 's'} on the ramps ·{' '}
                            {openJobs.length} open job{openJobs.length === 1 ? '' : 's'} ·{' '}
                            {formatRupees(thisMonth.total)} invoiced this month.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setDialog({ kind: 'booking-form' })}
                            className="btn-primary px-5 py-2 text-sm"
                        >
                            <UserPlus size={14} aria-hidden="true" /> Add booking
                        </button>
                        <button type="button" onClick={exportBookings} className="btn-secondary px-5 py-2 text-sm">
                            <Download size={14} aria-hidden="true" /> Export
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={BarChart3} label="Revenue this month"
                        value={formatRupeesCompact(thisMonth.total)}
                        note={growth === null ? `${thisMonth.count} jobs invoiced` : `${growth >= 0 ? '+' : ''}${growth}% on last month`}
                        onClick={() => setTab('Revenue')}
                    />
                    <StatCard
                        icon={Bell} label="Open bookings" value={openJobs.length}
                        note={`${inService.length} in service now`}
                        onClick={() => setTab('Workshop Floor')}
                    />
                    <StatCard
                        icon={Wrench} label="Technicians engaged"
                        value={workload.filter(t => t.active > 0).length}
                        note={`${workload.length} on the roster`}
                        onClick={() => setTab('Technicians')}
                    />
                    <StatCard
                        icon={Users} label="Average rating"
                        value={averageRating === null ? '—' : `${averageRating.toFixed(1)} ★`}
                        note={`${records.filter(r => r.rating !== null).length} rated visits`}
                    />
                </div>

                {/* Queue + activity */}
                <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
                    <div className="panel min-w-0 p-6 lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h2 className="font-bold text-ink">Live service queue</h2>
                            <button
                                type="button"
                                onClick={() => setTab('Workshop Floor')}
                                className="flex shrink-0 items-center gap-1 text-xs text-primary hover:underline"
                            >
                                View all <ChevronRight size={12} aria-hidden="true" />
                            </button>
                        </div>

                        {openJobs.length === 0 ? (
                            <EmptyState
                                icon={CheckCircle2}
                                title="The floor is clear"
                                message="No job is waiting, confirmed or in service right now."
                                action={
                                    <button
                                        type="button"
                                        onClick={() => setDialog({ kind: 'booking-form' })}
                                        className="btn-primary px-5 py-2.5 text-sm"
                                    >
                                        Add a booking
                                    </button>
                                }
                            />
                        ) : (
                            <ul className="space-y-3">
                                {openJobs.slice(0, 6).map(job => {
                                    const customer = customers.find(c => c.id === job.customerId);
                                    const vehicle = vehicles.find(v => v.id === job.vehicleId);
                                    return (
                                        <li
                                            key={job.id}
                                            className="flex flex-wrap items-center justify-between gap-3 rounded-sm bg-sand px-3 py-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span
                                                    aria-hidden="true"
                                                    className={`h-2 w-2 shrink-0 rounded-full ${job.status === 'In Service' ? 'bg-clay' : job.status === 'Confirmed' ? 'bg-primary' : 'bg-sand-deep'}`}
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-ink">
                                                        {customer?.name ?? 'Unknown customer'}
                                                    </p>
                                                    <p className="truncate text-xs text-muted">
                                                        {job.id} · {job.serviceName} · {vehicleLabel(vehicle)}
                                                        {job.technician ? ` · ${job.technician}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                <span className="hidden text-xs text-muted sm:inline">
                                                    {job.bay ?? 'No bay'} · {formatRelativeDay(job.scheduledFor)}
                                                </span>
                                                <BookingStatusSelect booking={job} />
                                                <button
                                                    type="button"
                                                    onClick={() => setDialog({ kind: 'job', booking: job })}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Update<span className="sr-only"> {job.id}</span>
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className="panel p-6">
                        <h2 className="mb-4 font-bold text-ink">Activity</h2>
                        {activity.length === 0 ? (
                            <p className="text-[0.875rem] text-muted">Nothing has moved yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {activity.map(entry => (
                                    <li key={entry.id} className="flex items-start gap-3">
                                        <span
                                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${entry.tone === 'success' ? 'bg-forest-pale' : entry.tone === 'warn' ? 'bg-clay-pale' : 'bg-sand'}`}
                                        >
                                            <entry.icon
                                                size={12}
                                                className={entry.tone === 'success' ? 'text-primary' : entry.tone === 'warn' ? 'text-clay-ink' : 'text-muted'}
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs leading-snug text-ink-soft">{entry.text}</p>
                                            <p className="mt-0.5 text-[10px] text-faint">{formatRelativeDay(entry.date)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Bays + quick actions */}
                <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
                    <div className="panel p-6">
                        <h2 className="mb-4 font-bold text-ink">Bay status</h2>
                        <ul className="space-y-2.5">
                            {bayStatus.map(({ bay, job }) => (
                                <li key={bay} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="min-w-0 truncate text-muted">
                                        {bay}
                                        {job ? ` — ${job.technician ?? 'unassigned'}` : ''}
                                    </span>
                                    {job ? (
                                        <button
                                            type="button"
                                            onClick={() => setDialog({ kind: 'job', booking: job })}
                                            className="shrink-0 text-xs font-bold text-clay-ink hover:underline"
                                        >
                                            {job.id}
                                        </button>
                                    ) : (
                                        <span className="shrink-0 text-xs font-bold text-primary">Free</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="panel p-6">
                        <h2 className="mb-4 font-bold text-ink">Quick actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: UserPlus, label: 'New booking', run: () => setDialog({ kind: 'booking-form' }) },
                                { icon: Users, label: 'Add customer', run: () => setDialog({ kind: 'customer-form', customer: null }) },
                                { icon: FileText, label: 'Export bookings', run: exportBookings },
                                { icon: Settings, label: 'Workshop settings', run: () => setTab('Settings') },
                            ].map(action => (
                                <button
                                    key={action.label}
                                    type="button"
                                    onClick={action.run}
                                    className="group flex flex-col items-center gap-2 rounded-sm border border-line bg-sand p-3 text-center transition-all hover:border-forest hover:bg-forest-pale"
                                >
                                    <action.icon size={18} className="text-muted transition-colors group-hover:text-primary" aria-hidden="true" />
                                    <span className="text-xs text-muted group-hover:text-ink">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Infographics — 3-up from 1024px only; at 768px the donut
                    and its legend had about 190px to share. */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="panel flex flex-col items-center p-6">
                        <h3 className="mb-4 self-start text-sm font-bold text-ink">Revenue by service</h3>
                        {revenueMix.length === 0 ? (
                            <p className="py-8 text-center text-[0.875rem] text-muted">Nothing invoiced yet.</p>
                        ) : (
                            <>
                                <svg
                                    viewBox="0 0 120 120" className="h-28 w-28" style={{ transform: 'rotate(-90deg)' }}
                                    role="img"
                                    aria-label={`Revenue by service: ${revenueMix.map(m => `${m.name} ${m.pct}%`).join(', ')}`}
                                >
                                    <circle cx="60" cy="60" r={DONUT_RADIUS} fill="none" stroke="rgba(23,26,24,0.08)" strokeWidth="14" />
                                    {revenueMix.map((slice, i) => {
                                        const offset = revenueMix.slice(0, i).reduce((sum, s) => sum + s.pct, 0);
                                        const length = (slice.pct / 100) * DONUT_CIRCUMFERENCE;
                                        const shades = ['#183f35', 'rgba(24,63,53,0.45)', 'rgba(24,63,53,0.18)'];
                                        return (
                                            <circle
                                                key={slice.name}
                                                cx="60" cy="60" r={DONUT_RADIUS} fill="none"
                                                stroke={shades[i % shades.length]} strokeWidth="14"
                                                strokeDasharray={`${length} ${DONUT_CIRCUMFERENCE - length}`}
                                                strokeDashoffset={`-${(offset / 100) * DONUT_CIRCUMFERENCE}`}
                                            />
                                        );
                                    })}
                                </svg>
                                <dl className="mt-3 w-full space-y-1.5">
                                    {revenueMix.map((slice, i) => (
                                        <div key={slice.name} className="flex items-center justify-between gap-2 text-xs">
                                            <dt className="flex min-w-0 items-center gap-2">
                                                <span
                                                    aria-hidden="true"
                                                    className={`h-2 w-2 shrink-0 rounded-full ${['bg-primary', 'bg-primary/45', 'bg-forest-pale'][i % 3]}`}
                                                />
                                                <span className="truncate text-muted">{slice.name}</span>
                                            </dt>
                                            <dd className="shrink-0 font-bold text-ink-soft">{slice.pct}%</dd>
                                        </div>
                                    ))}
                                </dl>
                            </>
                        )}
                    </div>

                    <div className="panel p-6">
                        <h3 className="mb-1 text-sm font-bold text-ink">Revenue trend</h3>
                        <p className="mb-4 text-xs text-muted">
                            {months[0].label} – {thisMonth.label}
                        </p>
                        <svg
                            viewBox="0 0 200 70" className="w-full" preserveAspectRatio="none"
                            role="img"
                            aria-label={`Revenue by month: ${months.map(m => `${m.label} ${formatRupees(m.total)}`).join(', ')}`}
                        >
                            <defs>
                                <linearGradient id="adminSpark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#183f35" stopOpacity="0.35" />
                                    <stop offset="100%" stopColor="#183f35" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={spark.area} fill="url(#adminSpark)" />
                            <path d={spark.line} fill="none" stroke="#183f35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            {spark.points.map(([x, y], i) => (
                                <circle key={i} cx={x} cy={y} r="3.5" fill="#183f35" />
                            ))}
                        </svg>
                        <div className="mt-1 flex justify-between text-[10px] text-faint">
                            {months.map(m => <span key={m.key}>{m.label}</span>)}
                        </div>
                        <p className="mt-3 text-xl font-bold text-primary">
                            {formatRupees(months.reduce((sum, m) => sum + m.total, 0))}
                        </p>
                    </div>

                    <div className="panel p-6">
                        <h3 className="mb-5 text-sm font-bold text-ink">Technician workload</h3>
                        {workload.length === 0 ? (
                            <p className="text-[0.875rem] text-muted">No work assigned yet.</p>
                        ) : (
                            <div className="space-y-3.5">
                                {workload.slice(0, 6).map(tech => (
                                    <div key={tech.name}>
                                        <div className="mb-1 flex justify-between gap-2 text-xs">
                                            <span className="truncate text-muted">{tech.name}</span>
                                            <span className={`shrink-0 font-bold ${tech.pct >= 90 ? 'text-clay-ink' : 'text-primary'}`}>
                                                {tech.completed + tech.active} jobs
                                            </span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-sand">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${tech.pct}%` }}
                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                                className={`h-full rounded-full ${tech.pct >= 90 ? 'bg-clay' : 'bg-primary'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top services */}
                <div className="panel p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <h2 className="font-bold text-ink">Top services by revenue</h2>
                        <span className="shrink-0 text-xs text-muted">Last six months</span>
                    </div>
                    {topServices.length === 0 ? (
                        <p className="text-[0.875rem] text-muted">Nothing invoiced yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {topServices.map(service => (
                                <div key={service.name}>
                                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                                        <span className="text-sm text-ink-soft">{service.name}</span>
                                        <span className="flex shrink-0 items-center gap-4 text-xs">
                                            <span className="text-muted">{service.count} jobs</span>
                                            <span className="font-bold text-primary">{formatRupees(service.total)}</span>
                                        </span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-sand">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${service.bar}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className="h-full rounded-full bg-primary"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderCustomers = () => (
        <motion.div key="customers" {...fade} className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-ink">Customer management</h2>
                    <p className="mt-0.5 text-xs text-muted">
                        {customers.length} on the book · {customers.filter(c => c.status === 'Active').length} active
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setDialog({ kind: 'customer-form', customer: null })}
                    className="btn-primary px-4 py-2 text-sm"
                >
                    <UserPlus size={14} aria-hidden="true" /> Add customer
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total customers" value={customers.length} />
                <StatCard label="Premium members" value={customers.filter(c => c.plan === 'Premium').length} />
                <StatCard label="Vehicles on record" value={vehicles.length} />
            </div>

            <div className="panel p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-sm border border-line bg-sand px-3 py-2 sm:max-w-sm">
                        <Search size={14} className="shrink-0 text-muted" aria-hidden="true" />
                        <input
                            id="admin-customer-search"
                            type="search"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            aria-label="Search customers by name, email, vehicle or service"
                            placeholder="Name, email, plate or service…"
                            className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                aria-label="Clear search"
                                className="shrink-0 text-faint transition-colors hover:text-ink"
                            >
                                <XCircle size={14} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                    <button type="button" onClick={exportCustomers} className="btn-secondary px-4 py-2 text-xs">
                        <Download size={12} aria-hidden="true" /> Export
                    </button>
                    <p role="status" aria-live="polite" className="w-full text-xs text-muted sm:w-auto">
                        {query
                            ? `${visibleCustomers.length} of ${customers.length} match “${debouncedSearch.trim()}”`
                            : `Showing all ${customers.length}`}
                    </p>
                </div>

                {visibleCustomers.length === 0 ? (
                    <EmptyState
                        icon={SearchX}
                        title="No customer matches that"
                        message={`Nothing on the book matches “${debouncedSearch.trim()}”. Searches cover name, email, phone, city, vehicle, plate and service.`}
                        action={
                            <button type="button" onClick={() => setSearch('')} className="btn-secondary px-5 py-2.5 text-sm">
                                Clear search
                            </button>
                        }
                    />
                ) : (
                    // `relative` is load-bearing: the sr-only labels inside the
                    // table are absolutely positioned, and without a containing
                    // block here they escaped this scroller's clip and gave the
                    // whole page a few hundred px of sideways scroll on a phone.
                    <div className="relative -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                        <table className="w-full min-w-[52rem] text-sm">
                            <caption className="sr-only">Customers on the workshop book</caption>
                            <thead>
                                <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-faint">
                                    <th scope="col" className="pb-3 text-left">Customer</th>
                                    <th scope="col" className="pb-3 text-left">Vehicles</th>
                                    <th scope="col" className="pb-3 text-left">Last visit</th>
                                    <th scope="col" className="pb-3 text-center">Visits</th>
                                    <th scope="col" className="pb-3 text-right">Total spent</th>
                                    <th scope="col" className="pb-3 text-left">Plan</th>
                                    <th scope="col" className="pb-3 text-left">Status</th>
                                    <th scope="col" className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleCustomers.map(customer => {
                                    const theirVehicles = vehicles.filter(v => v.ownerId === customer.id);
                                    const theirRecords = records
                                        .filter(r => r.customerId === customer.id)
                                        .sort((a, b) => b.completedOn.localeCompare(a.completedOn));
                                    const spend = theirRecords.reduce((sum, r) => sum + r.cost, 0);

                                    return (
                                        <tr key={customer.id} className="border-b border-line transition-colors hover:bg-sand">
                                            <td className="py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setDialog({ kind: 'customer-details', customer })}
                                                    className="flex items-center gap-2 text-left"
                                                >
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-pale text-xs font-bold text-primary">
                                                        {customer.name[0]}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block font-medium text-ink hover:underline">{customer.name}</span>
                                                        <span className="block truncate text-xs text-muted">{customer.email}</span>
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="py-3 text-muted">
                                                {theirVehicles.length === 0 ? (
                                                    <span className="text-faint">None on record</span>
                                                ) : (
                                                    <>
                                                        {vehicleLabel(theirVehicles[0])}
                                                        {theirVehicles.length > 1 && (
                                                            <span className="text-faint"> +{theirVehicles.length - 1}</span>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                            <td className="py-3 whitespace-nowrap text-muted">
                                                {formatDate(theirRecords[0]?.completedOn ?? null)}
                                            </td>
                                            <td className="py-3 text-center font-mono text-ink-soft">{theirRecords.length}</td>
                                            <td className="py-3 text-right font-semibold text-primary">{formatRupees(spend)}</td>
                                            <td className="py-3"><StatusBadge status={customer.plan} size="sm" /></td>
                                            <td className="py-3"><StatusBadge status={customer.status} size="sm" /></td>
                                            <td className="py-3 text-right">
                                                <span className="inline-flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDialog({ kind: 'customer-form', customer })}
                                                        className="rounded-sm bg-sand px-3 py-1 text-xs text-muted transition-colors hover:bg-forest-pale hover:text-primary"
                                                    >
                                                        Edit<span className="sr-only"> {customer.name}</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDialog({ kind: 'customer-remove', customer })}
                                                        className="rounded-sm bg-sand px-3 py-1 text-xs text-muted transition-colors hover:bg-clay-pale hover:text-clay-ink"
                                                    >
                                                        Remove<span className="sr-only"> {customer.name}</span>
                                                    </button>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderTechnicians = () => (
        <motion.div key="technicians" {...fade} className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-ink">Technician workload</h2>
                <p className="mt-0.5 text-xs text-muted">
                    {workload.length} on the roster · {workload.filter(t => t.active > 0).length} with a job in hand
                </p>
            </div>

            {workload.length === 0 ? (
                <div className="panel">
                    <EmptyState
                        icon={Wrench}
                        title="No work on the roster"
                        message="Assign a technician to a job and their workload appears here."
                    />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workload.map(tech => {
                        const theirJobs = openJobs.filter(b => b.technician === tech.name);
                        const rated = records.filter(r => r.technician === tech.name && r.rating !== null);
                        const rating = rated.length
                            ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
                            : null;

                        return (
                            <div key={tech.name} className="panel border-line p-5 transition-colors hover:border-forest">
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-pale text-sm font-bold text-primary">
                                            {tech.name[0]}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-ink">{tech.name}</p>
                                            <p className="text-xs text-primary">
                                                {tech.active > 0 ? `${tech.active} job${tech.active === 1 ? '' : 's'} in hand` : 'Free'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${tech.active > 0 ? 'bg-clay-pale text-clay-ink' : 'bg-forest-pale text-primary'}`}>
                                        {tech.active > 0 ? 'On a job' : 'Available'}
                                    </span>
                                </div>

                                <dl className="space-y-2 border-t border-line pt-3 text-xs">
                                    <div className="flex justify-between gap-2">
                                        <dt className="text-muted">Services completed</dt>
                                        <dd className="font-bold text-ink">{tech.completed}</dd>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <dt className="text-muted">Average rating</dt>
                                        <dd className="flex items-center gap-1 font-bold text-clay-ink">
                                            {rating === null ? <span className="text-muted">Not rated</span> : (
                                                <>
                                                    <Star size={10} className="fill-clay" aria-hidden="true" />
                                                    {rating.toFixed(1)}
                                                </>
                                            )}
                                        </dd>
                                    </div>
                                </dl>

                                {theirJobs.length > 0 && (
                                    <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                                        {theirJobs.map(job => (
                                            <li key={job.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => setDialog({ kind: 'job', booking: job })}
                                                    className="flex w-full items-center justify-between gap-2 text-xs text-muted transition-colors hover:text-ink"
                                                >
                                                    <span className="min-w-0 truncate">
                                                        <span className="font-mono text-primary">{job.id}</span> · {job.serviceName}
                                                    </span>
                                                    <ChevronRight size={12} className="shrink-0" aria-hidden="true" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );

    const renderRevenue = () => {
        const total = months.reduce((sum, m) => sum + m.total, 0);
        const jobs = months.reduce((sum, m) => sum + m.count, 0);
        const peak = Math.max(...months.map(m => m.total), 1);

        return (
            <motion.div key="revenue" {...fade} className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-ink">Revenue overview</h2>
                        <p className="mt-0.5 text-xs text-muted">
                            {months[0].label} – {thisMonth.label} · invoiced work only
                        </p>
                    </div>
                    <button type="button" onClick={exportRevenue} className="btn-secondary px-4 py-2 text-sm">
                        <Download size={14} aria-hidden="true" /> Export report
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total (6 months)" value={formatRupeesCompact(total)} note={`${jobs} jobs`} />
                    <StatCard label="This month" value={formatRupeesCompact(thisMonth.total)} note={`${thisMonth.count} jobs`} />
                    <StatCard
                        label="Average per job"
                        value={jobs === 0 ? '—' : formatRupees(Math.round(total / jobs))}
                    />
                    <StatCard label="Outstanding" value={formatRupees(0)} note="All invoices settled" />
                </div>

                <div className="panel p-6">
                    <h3 className="mb-6 font-bold text-ink">Monthly revenue</h3>
                    {total === 0 ? (
                        <EmptyState title="Nothing invoiced in this window" />
                    ) : (
                        <div className="flex h-40 items-end gap-2 sm:gap-4">
                            {months.map((month, i) => (
                                <div key={month.key} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                                    <span className="truncate text-[10px] font-bold text-primary sm:text-xs">
                                        {formatRupeesCompact(month.total)}
                                    </span>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(month.total / peak) * 100}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                                        className={`w-full rounded-t-lg ${i === months.length - 1 ? 'bg-primary' : 'bg-forest-pale'}`}
                                    />
                                    <span className="text-xs text-muted">{month.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="panel p-4 sm:p-6">
                    <h3 className="mb-5 font-bold text-ink">Monthly breakdown</h3>
                    <div className="relative -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                        <table className="w-full min-w-[32rem] text-sm">
                            <caption className="sr-only">Revenue by month</caption>
                            <thead>
                                <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-faint">
                                    <th scope="col" className="pb-3 text-left">Month</th>
                                    <th scope="col" className="pb-3 text-right">Revenue</th>
                                    <th scope="col" className="pb-3 text-right">Jobs</th>
                                    <th scope="col" className="pb-3 text-right">Average per job</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...months].reverse().map(month => (
                                    <tr key={month.key} className="border-b border-line transition-colors hover:bg-sand">
                                        <td className="py-3 font-medium text-ink">{month.label} {month.key.slice(0, 4)}</td>
                                        <td className="py-3 text-right font-bold text-primary">{formatRupees(month.total)}</td>
                                        <td className="py-3 text-right text-muted">{month.count}</td>
                                        <td className="py-3 text-right font-mono text-xs text-muted">
                                            {month.count === 0 ? '—' : formatRupees(Math.round(month.total / month.count))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderFloor = () => {
        const counts: Record<FloorFilter, number> = {
            All: openJobs.length,
            Pending: openJobs.filter(b => b.status === 'Pending').length,
            Confirmed: openJobs.filter(b => b.status === 'Confirmed').length,
            'In Service': openJobs.filter(b => b.status === 'In Service').length,
            Completed: bookings.filter(b => b.status === 'Completed').length,
            Cancelled: bookings.filter(b => b.status === 'Cancelled').length,
        };

        return (
            <motion.div key="floor" {...fade} className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-ink">Workshop floor</h2>
                        <p className="mt-0.5 text-xs text-muted">
                            {openJobs.length} open job{openJobs.length === 1 ? '' : 's'} ·{' '}
                            {counts['In Service']} on the ramps
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDialog({ kind: 'booking-form' })}
                        className="btn-primary px-4 py-2 text-sm"
                    >
                        <UserPlus size={14} aria-hidden="true" /> Add booking
                    </button>
                </div>

                {/* Filters — the summary tiles double as the filter control */}
                <div
                    role="group"
                    aria-label="Filter jobs by status"
                    className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                    {(['All', 'Pending', 'Confirmed', 'In Service'] as const).map(option => {
                        const selected = floorFilter === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setFloorFilter(option)}
                                className={`panel p-4 text-center transition-colors ${selected ? 'border-forest bg-forest-pale' : 'border-line hover:border-forest'}`}
                            >
                                <span className={`block text-2xl font-bold ${option === 'In Service' ? 'text-clay-ink' : 'text-primary'}`}>
                                    {counts[option]}
                                </span>
                                <span className="mt-1 block text-xs text-muted">{option}</span>
                            </button>
                        );
                    })}
                </div>

                {floorJobs.length === 0 ? (
                    <div className="panel">
                        <EmptyState
                            icon={floorFilter === 'All' ? CheckCircle2 : SearchX}
                            title={floorFilter === 'All' ? 'The floor is clear' : `No job is ${floorFilter.toLowerCase()}`}
                            message={floorFilter === 'All'
                                ? 'Nothing is waiting, confirmed or in service right now.'
                                : 'Try another status, or add a booking.'}
                            action={floorFilter === 'All' ? (
                                <button
                                    type="button"
                                    onClick={() => setDialog({ kind: 'booking-form' })}
                                    className="btn-primary px-5 py-2.5 text-sm"
                                >
                                    Add a booking
                                </button>
                            ) : (
                                <button type="button" onClick={() => setFloorFilter('All')} className="btn-secondary px-5 py-2.5 text-sm">
                                    Show all jobs
                                </button>
                            )}
                        />
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {floorJobs.map(job => {
                            const vehicle = vehicles.find(v => v.id === job.vehicleId);
                            const customer = customers.find(c => c.id === job.customerId);
                            return (
                                <li
                                    key={job.id}
                                    className="panel flex flex-col justify-between gap-4 p-5 transition-colors hover:border-forest sm:flex-row sm:items-center"
                                >
                                    <div className="flex min-w-0 items-start gap-4">
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-forest-pale">
                                            <Car size={22} className="text-primary" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-ink">{vehicleLabel(vehicle)}</p>
                                            <p className="mt-0.5 text-xs text-muted">
                                                {vehicle?.registration ?? 'No plate on record'} · Owner: {customer?.name ?? 'unknown'}
                                            </p>
                                            <p className="mt-1 text-xs text-muted">
                                                <span className="font-mono text-primary">{job.id}</span> · {job.serviceName}
                                                {vehicle ? ` · ${formatKm(vehicle.odometerKm)}` : ''}
                                                {job.bay ? ` · ${job.bay}` : ' · no bay'}
                                                {job.technician ? ` · ${job.technician}` : ' · no technician'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                                        <span className="text-xs text-muted">
                                            {formatRelativeDay(job.scheduledFor)} · {job.slot}
                                        </span>
                                        <BookingStatusSelect booking={job} />
                                        <button
                                            type="button"
                                            onClick={() => setDialog({ kind: 'job', booking: job })}
                                            className="btn-secondary px-4 py-2 text-xs"
                                        >
                                            Update<span className="sr-only"> {job.id}</span>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </motion.div>
        );
    };

    const sections: Record<string, () => React.ReactNode> = {
        Overview: renderOverview,
        Customers: renderCustomers,
        Technicians: renderTechnicians,
        Revenue: renderRevenue,
        'Workshop Floor': renderFloor,
        Settings: () => (
            <motion.div key="admin-settings" {...fade}>
                <WorkshopSettings onResetWorkshop={resetWorkshop} />
            </motion.div>
        ),
    };

    return (
        <div className="bg-paper">
            <DashboardTabs
                tabs={tabs}
                active={tab}
                onChange={setTab}
                idPrefix="admin"
                actions={
                    <>
                        <button
                            type="button"
                            onClick={() => setDialog({ kind: 'booking-form' })}
                            className="btn-primary px-4 py-2 text-xs"
                        >
                            <UserPlus size={13} aria-hidden="true" /> Add booking
                        </button>
                        <button type="button" onClick={exportBookings} className="btn-secondary px-4 py-2 text-xs">
                            <Download size={13} aria-hidden="true" /> Export
                        </button>
                    </>
                }
            />

            <div
                {...dashboardPanelProps('admin', tab)}
                className="mx-auto max-w-7xl px-4 py-6 pb-12"
            >
                <AnimatePresence mode="wait">
                    {sections[tab]?.()}
                </AnimatePresence>
            </div>

            {/* ── Dialogs ──────────────────────────────────────── */}

            {dialog.kind === 'job' && (
                <JobUpdateDialog open onClose={close} booking={dialog.booking} />
            )}

            {dialog.kind === 'customer-details' && (
                <CustomerDetailsDialog
                    open onClose={close}
                    customer={dialog.customer}
                    onEdit={customer => setDialog({ kind: 'customer-form', customer })}
                    onNewBooking={customer => setDialog({ kind: 'booking-form', customerId: customer.id })}
                />
            )}

            {dialog.kind === 'customer-form' && (
                <CustomerFormDialog open onClose={close} customer={dialog.customer} />
            )}

            {dialog.kind === 'customer-remove' && (
                <ConfirmDialog
                    open onClose={close}
                    tone="danger"
                    title="Remove this customer?"
                    confirmLabel="Remove customer"
                    message={
                        <>
                            <strong className="font-semibold text-ink">{dialog.customer.name}</strong>{' '}
                            will be taken off the book along with{' '}
                            {vehicles.filter(v => v.ownerId === dialog.customer.id).length} vehicle
                            {vehicles.filter(v => v.ownerId === dialog.customer.id).length === 1 ? '' : 's'},
                            and any open job against the account will be cancelled. Invoiced work stays
                            in the revenue ledger.
                        </>
                    }
                    onConfirm={() => confirmRemoveCustomer(dialog.customer)}
                />
            )}

            {dialog.kind === 'booking-form' && (
                <BookingFormDialog
                    open onClose={close}
                    vehicles={vehicles}
                    customers={customers}
                    customerId={dialog.customerId ?? customers[0]?.id ?? ''}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
