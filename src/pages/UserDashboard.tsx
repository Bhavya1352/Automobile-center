import React, { useCallback, useMemo, useState } from 'react';
import {
    Car, Wrench, Clock, ShieldCheck, FileText, Settings,
    LayoutDashboard, CalendarCheck, CheckCircle2, Plus, Download,
    Star, TrendingUp, BadgeCheck, CreditCard, ChevronRight, Sparkles,
    AlertTriangle, Pencil, Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { DashboardTabs } from '../components/dashboard/DashboardTabs';
import { StatCard } from '../components/dashboard/StatCard';
import { VehicleCard } from '../components/dashboard/VehicleCard';
import { VehicleFormDialog } from '../components/dashboard/VehicleFormDialog';
import { VehicleDetailsDialog } from '../components/dashboard/VehicleDetailsDialog';
import { BookingFormDialog } from '../components/dashboard/BookingFormDialog';
import { BookingDetailsDialog } from '../components/dashboard/BookingDetailsDialog';
import { ServiceRecordDialog } from '../components/dashboard/ServiceRecordDialog';
import { VehicleCheckDialog } from '../components/dashboard/VehicleCheckDialog';
import { RecommendationDialog } from '../components/dashboard/RecommendationDialog';
import { AccountSettings } from '../components/dashboard/AccountSettings';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState, ErrorState, LoadingState, Skeleton } from '../components/ui/DataState';

import { useWorkshop, useCustomerView, vehicleLabel } from '../hooks/useWorkshop';
import { useTabParam, dashboardPanelProps } from '../hooks/useTabParam';
import { useToast } from '../hooks/useToast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

import { buildRecommendations } from '../lib/recommendations';
import {
    DONUT_CIRCUMFERENCE, DONUT_RADIUS, monthlyTotals, shareByService, sparklinePath,
} from '../lib/analytics';
import { downloadCsv } from '../lib/csv';
import { formatDate, formatKm, formatRupees } from '../lib/format';
import { CURRENT_CUSTOMER_ID, SERVICE_OPTIONS } from '../data/workshopData';
import { BOOKING_STATUSES, CANCELLABLE_STATUSES } from '../types/workshop';

import type { Recommendation } from '../lib/recommendations';
import type { Booking, BookingStatus, OwnedVehicle, ServiceRecord } from '../types/workshop';

/* ─── Tabs ──────────────────────────────────────────────── */

const tabs = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Car, label: 'My Vehicles' },
    { icon: Wrench, label: 'Service History' },
    { icon: CalendarCheck, label: 'Appointments' },
    { icon: FileText, label: 'Invoices' },
    { icon: Settings, label: 'Settings' },
] as const;

const TAB_LABELS = tabs.map(t => t.label);

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

/** Progress a job moves through; Cancelled sits outside it. */
const PIPELINE: readonly BookingStatus[] = BOOKING_STATUSES.filter(s => s !== 'Cancelled');

/** One point per ₹20 spent — the rate the loyalty panel advertises. */
const POINTS_PER_RUPEE = 1 / 20;
const POINTS_PER_TIER = 4000;

/**
 * One dialog is open at a time, so the open modal is a single piece of
 * state rather than eight booleans that can contradict each other.
 */
type Dialog =
    | { kind: 'none' }
    | { kind: 'vehicle-form'; vehicle: OwnedVehicle | null }
    | { kind: 'vehicle-details'; vehicle: OwnedVehicle }
    | { kind: 'vehicle-remove'; vehicle: OwnedVehicle }
    | { kind: 'booking-form'; vehicleId?: string; serviceSlug?: string; notes?: string }
    | { kind: 'booking-details'; booking: Booking }
    | { kind: 'booking-cancel'; booking: Booking }
    | { kind: 'check'; vehicleId?: string }
    | { kind: 'record'; record: ServiceRecord }
    | { kind: 'recommendation'; recommendation: Recommendation };

const CLOSED: Dialog = { kind: 'none' };

/* ─── Component ─────────────────────────────────────────── */

const UserDashboard: React.FC = () => {
    useDocumentTitle('Your dashboard');

    const {
        status, error, reload, customers,
        removeVehicle, cancelBooking, resetWorkshop,
    } = useWorkshop();
    const view = useCustomerView(CURRENT_CUSTOMER_ID);
    const { showToast } = useToast();

    const [tab, setTab] = useTabParam(TAB_LABELS);
    const [dialog, setDialog] = useState<Dialog>(CLOSED);
    const close = useCallback(() => setDialog(CLOSED), []);

    const customer = customers.find(c => c.id === CURRENT_CUSTOMER_ID);
    const firstName = customer?.name.split(' ')[0] ?? 'there';

    /* ── Derived figures ──────────────────────────────────── */

    const recommendations = useMemo(
        () => buildRecommendations(view.vehicles, view.records),
        [view.vehicles, view.records],
    );

    const activeJob = useMemo(
        () => view.upcoming.find(b => b.status === 'In Service') ?? view.upcoming[0] ?? null,
        [view.upcoming],
    );

    /** The vehicle closest to its next service, which is the one the
     *  owner actually needs to be told about. */
    const soonest = useMemo(() => {
        const sorted = [...view.vehicles].sort(
            (a, b) => (a.nextServiceKm - a.odometerKm) - (b.nextServiceKm - b.odometerKm),
        );
        return sorted[0] ?? null;
    }, [view.vehicles]);

    const months = useMemo(() => monthlyTotals(view.records, 6), [view.records]);
    const spark = useMemo(() => sparklinePath(months.map(m => m.total)), [months]);
    const mix = useMemo(() => shareByService(view.records, 3), [view.records]);
    const points = Math.round(view.totalSpend * POINTS_PER_RUPEE);

    /* ── Actions ──────────────────────────────────────────── */

    const openBooking = useCallback((vehicleId?: string, serviceSlug?: string, notes?: string) => {
        setDialog({ kind: 'booking-form', vehicleId, serviceSlug, notes });
    }, []);

    const confirmRemoveVehicle = useCallback(async (vehicle: OwnedVehicle) => {
        await removeVehicle(vehicle.id);
        showToast(`${vehicleLabel(vehicle)} removed from your garage.`);
    }, [removeVehicle, showToast]);

    const confirmCancelBooking = useCallback(async (booking: Booking) => {
        await cancelBooking(booking.id);
        showToast(`${booking.serviceName} (${booking.id}) cancelled.`, 'info');
    }, [cancelBooking, showToast]);

    const exportHistory = useCallback(() => {
        if (view.records.length === 0) {
            showToast('There is no service history to export yet.', 'info');
            return;
        }
        const ok = downloadCsv(
            'autosphere-service-history.csv',
            view.records.map(record => ({
                'Service ID': record.id,
                Invoice: record.invoiceId,
                Date: record.completedOn,
                Vehicle: vehicleLabel(view.vehicles.find(v => v.id === record.vehicleId)),
                Service: record.serviceName,
                Technician: record.technician,
                'Odometer (km)': record.odometerKm,
                'Cost (INR)': record.cost,
                Rating: record.rating ?? '',
            })),
            ['Service ID', 'Invoice', 'Date', 'Vehicle', 'Service', 'Technician',
                'Odometer (km)', 'Cost (INR)', 'Rating'],
        );
        showToast(
            ok ? `${view.records.length} services exported.` : 'The download could not be started.',
            ok ? 'success' : 'error',
        );
    }, [view.records, view.vehicles, showToast]);

    /* ── Loading and failure ──────────────────────────────── */

    if (status === 'loading') {
        return (
            <div className="bg-paper">
                <DashboardTabs tabs={tabs} active={tab} onChange={setTab} idPrefix="user" />
                <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
                    <LoadingState label="Loading your garage…" />
                    <Skeleton rows={4} />
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="bg-paper">
                <DashboardTabs tabs={tabs} active={tab} onChange={setTab} idPrefix="user" />
                <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
                    <ErrorState
                        message={error ?? 'Your dashboard could not be loaded.'}
                        onRetry={reload}
                    />
                </div>
            </div>
        );
    }

    /* ── Sections ─────────────────────────────────────────── */

    const renderDashboard = () => {
        const reached = activeJob ? PIPELINE.indexOf(activeJob.status) : -1;
        const progress = reached < 0 ? 0 : Math.round((reached / (PIPELINE.length - 1)) * 100);
        const dueIn = soonest ? soonest.nextServiceKm - soonest.odometerKm : null;

        return (
            <motion.div key="dashboard" {...fade} className="space-y-6">
                {/* Welcome — a flat forest-pale band like every other panel.
                    The 135deg gradient this carried was the only one left. */}
                <div className="flex flex-col justify-between gap-4 rounded-sm border border-forest bg-forest-pale p-6 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            {customer && <StatusBadge status={customer.plan} size="sm" />}
                            <span className="text-xs text-muted">· {view.vehicles.length} vehicle{view.vehicles.length === 1 ? '' : 's'} on record</span>
                        </div>
                        <h1 className="title-lg text-[1.5rem]">Welcome back, {firstName}</h1>
                        <p className="mt-1 text-sm text-muted">
                            {activeJob
                                ? `${activeJob.serviceName} · ${activeJob.id} · ${activeJob.status.toLowerCase()}${activeJob.bay ? ` in ${activeJob.bay}` : ''}.`
                                : 'Nothing booked at the moment. Your garage is up to date.'}
                        </p>
                    </div>
                    <div className="mt-4 flex w-full shrink-0 flex-col gap-3 sm:mt-0 sm:w-auto sm:flex-row">
                        <button
                            type="button"
                            onClick={() => openBooking()}
                            className="btn-primary w-full px-5 py-2 text-sm sm:w-auto"
                        >
                            Book service
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('Service History')}
                            className="btn-secondary w-full px-5 py-2 text-sm sm:w-auto"
                        >
                            View history
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Wrench} label="Services done" value={view.visits}
                        note={view.lastVisitOn ? `Last on ${formatDate(view.lastVisitOn)}` : 'No visits yet'}
                        onClick={() => setTab('Service History')}
                    />
                    <StatCard
                        icon={Clock} label="Next service"
                        value={dueIn === null ? '—' : dueIn > 0 ? formatKm(dueIn) : 'Overdue'}
                        note={soonest ? vehicleLabel(soonest) : 'Add a vehicle to track this'}
                        onClick={() => setTab('My Vehicles')}
                    />
                    <StatCard
                        icon={Car} label="Vehicles" value={view.vehicles.length}
                        note={`${view.vehicles.filter(v => v.status === 'In Service').length} in service now`}
                        onClick={() => setTab('My Vehicles')}
                    />
                    <StatCard
                        icon={CalendarCheck} label="Open bookings" value={view.upcoming.length}
                        note={view.upcoming[0] ? `Next ${formatDate(view.upcoming[0].scheduledFor)}` : 'Nothing booked'}
                        onClick={() => setTab('Appointments')}
                    />
                </div>

                {/* Current job + primary vehicle */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="panel p-6 lg:col-span-2">
                        {activeJob ? (
                            <>
                                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="font-bold text-ink">Current service progress</h2>
                                        <p className="mt-0.5 text-xs text-muted">
                                            {activeJob.id} · {activeJob.serviceName}
                                            {activeJob.bay ? ` · ${activeJob.bay}` : ''}
                                            {activeJob.technician ? ` · ${activeJob.technician}` : ' · technician to be assigned'}
                                        </p>
                                    </div>
                                    <StatusBadge status={activeJob.status} size="sm" />
                                </div>

                                <ol className="mb-5 space-y-4">
                                    {PIPELINE.map((step, i) => {
                                        const done = i <= reached;
                                        const current = i === reached;
                                        return (
                                            <li key={step} className="flex items-center gap-4">
                                                <span
                                                    aria-hidden="true"
                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${done ? 'bg-primary' : 'bg-sand'}`}
                                                >
                                                    {done
                                                        ? <CheckCircle2 size={14} className="text-secondary" />
                                                        : <span className="h-1.5 w-1.5 rounded-full bg-faint" />}
                                                </span>
                                                <span className={`flex-1 text-sm ${done ? 'font-medium text-ink' : 'text-muted'}`}>
                                                    {step}
                                                </span>
                                                {current && <span className="text-xs font-bold text-primary">Current</span>}
                                            </li>
                                        );
                                    })}
                                </ol>

                                <div>
                                    <div className="mb-1 flex justify-between text-xs text-muted">
                                        <span>Overall progress</span><span>{progress}%</span>
                                    </div>
                                    <div
                                        className="h-2 overflow-hidden rounded-full bg-sand"
                                        role="progressbar"
                                        aria-valuenow={progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={`${activeJob.serviceName} progress`}
                                    >
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.8 }}
                                            className="h-full rounded-full bg-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                                    <p className="text-xs text-muted">
                                        Scheduled for <span className="font-medium text-ink-soft">
                                            {formatDate(activeJob.scheduledFor)} · {activeJob.slot}
                                        </span>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setDialog({ kind: 'booking-details', booking: activeJob })}
                                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                                    >
                                        View booking <ChevronRight size={12} aria-hidden="true" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <EmptyState
                                icon={CalendarCheck}
                                title="No service in progress"
                                message="When a job is booked in, its progress through the workshop appears here."
                                action={
                                    <button type="button" onClick={() => openBooking()} className="btn-primary px-5 py-2.5 text-sm">
                                        Book a service
                                    </button>
                                }
                            />
                        )}
                    </div>

                    {soonest ? (
                        <div className="panel relative overflow-hidden border-forest p-6">
                            <Car size={100} className="pointer-events-none absolute -bottom-6 -right-6 text-primary opacity-5" aria-hidden="true" />
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <h2 className="font-bold text-ink">Primary vehicle</h2>
                                <StatusBadge status={soonest.status} size="sm" />
                            </div>
                            <p className="text-xl font-bold text-ink">{soonest.make} {soonest.model}</p>
                            <p className="mb-4 text-sm text-primary">
                                {[soonest.variant, soonest.year, soonest.fuel].filter(Boolean).join(' · ')}
                            </p>
                            <dl className="space-y-2.5 border-t border-line pt-4 text-sm">
                                {[
                                    { l: 'Registration', v: soonest.registration },
                                    { l: 'Odometer', v: formatKm(soonest.odometerKm) },
                                    { l: 'Next service', v: formatKm(soonest.nextServiceKm) },
                                    { l: 'Insurance', v: formatDate(soonest.insuranceValidTill) },
                                ].map(row => (
                                    <div key={row.l} className="flex justify-between gap-3">
                                        <dt className="text-muted">{row.l}</dt>
                                        <dd className="text-right text-ink">{row.v}</dd>
                                    </div>
                                ))}
                            </dl>
                            <button
                                type="button"
                                onClick={() => setDialog({ kind: 'vehicle-details', vehicle: soonest })}
                                className="btn-secondary mt-4 w-full py-2 text-sm"
                            >
                                View full record
                            </button>
                        </div>
                    ) : (
                        <div className="panel p-6">
                            <EmptyState
                                icon={Car}
                                title="Your garage is empty"
                                message="Add a vehicle and the dashboard starts tracking its intervals."
                                action={
                                    <button
                                        type="button"
                                        onClick={() => setDialog({ kind: 'vehicle-form', vehicle: null })}
                                        className="btn-primary px-5 py-2.5 text-sm"
                                    >
                                        <Plus size={14} aria-hidden="true" /> Add vehicle
                                    </button>
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Alerts, drawn from the record */}
                {recommendations.length > 0 && (
                    <div className="space-y-3">
                        {recommendations.slice(0, 3).map(rec => (
                            <div
                                key={rec.id}
                                className={`panel flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center ${rec.priority === 'Routine' ? 'border-line' : 'border-clay'}`}
                            >
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${rec.priority === 'Routine' ? 'bg-forest-pale' : 'bg-clay-pale'}`}>
                                    {rec.priority === 'Routine'
                                        ? <ShieldCheck size={18} className="text-primary" aria-hidden="true" />
                                        : <AlertTriangle size={18} className="text-clay-ink" aria-hidden="true" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-ink">{rec.title}</p>
                                    <p className="mt-0.5 text-xs text-muted">{rec.vehicleLabel} · {rec.summary}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDialog({ kind: 'recommendation', recommendation: rec })}
                                    className="btn-secondary mt-2 w-full shrink-0 px-4 py-2 text-xs sm:mt-0 sm:w-auto"
                                >
                                    View recommendation
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Infographics — 3-up only from 1024px: at 768px three of
                    these left the donut and its legend about 190px wide. */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Service mix */}
                    <div className="panel flex flex-col items-center p-6">
                        <h3 className="mb-4 self-start text-sm font-bold text-ink">Service mix</h3>
                        {mix.length === 0 ? (
                            <p className="py-8 text-center text-[0.875rem] text-muted">
                                No completed services yet.
                            </p>
                        ) : (
                            <>
                                <svg
                                    viewBox="0 0 120 120" className="h-28 w-28" style={{ transform: 'rotate(-90deg)' }}
                                    role="img"
                                    aria-label={`Spend by service: ${mix.map(m => `${m.name} ${m.pct}%`).join(', ')}`}
                                >
                                    <circle cx="60" cy="60" r={DONUT_RADIUS} fill="none" stroke="rgba(23,26,24,0.08)" strokeWidth="14" />
                                    {mix.map((slice, i) => {
                                        const offset = mix.slice(0, i).reduce((sum, s) => sum + s.pct, 0);
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
                                    {mix.map((slice, i) => (
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

                    {/* Monthly spend */}
                    <div className="panel p-6">
                        <h3 className="mb-1 text-sm font-bold text-ink">Monthly spend</h3>
                        <p className="mb-4 text-xs text-muted">Last six months</p>
                        <svg
                            viewBox="0 0 200 70" className="w-full" preserveAspectRatio="none"
                            role="img"
                            aria-label={`Spend by month: ${months.map(m => `${m.label} ${formatRupees(m.total)}`).join(', ')}`}
                        >
                            <defs>
                                <linearGradient id="userSpark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#183f35" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#183f35" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={spark.area} fill="url(#userSpark)" />
                            <path d={spark.line} fill="none" stroke="#183f35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            {spark.points.map(([x, y], i) => (
                                <circle key={i} cx={x} cy={y} r="3" fill="#183f35" />
                            ))}
                        </svg>
                        <div className="mt-1 flex justify-between text-[10px] text-faint">
                            {months.map(m => <span key={m.key}>{m.label}</span>)}
                        </div>
                        <p className="mt-3 text-xl font-bold text-primary">
                            {formatRupees(months.reduce((sum, m) => sum + m.total, 0))}
                        </p>
                    </div>

                    {/* Vehicle health */}
                    <div className="panel p-6">
                        <h3 className="mb-5 text-sm font-bold text-ink">Vehicle health</h3>
                        {view.vehicles.length === 0 ? (
                            <p className="text-[0.875rem] text-muted">No vehicles on record.</p>
                        ) : (
                            <div className="space-y-4">
                                {view.vehicles.map(vehicle => {
                                    const assessed = Boolean(vehicle.lastServiceOn);
                                    const low = vehicle.healthScore < 70;
                                    return (
                                        <div key={vehicle.id}>
                                            <div className="mb-1 flex justify-between gap-2 text-xs">
                                                <span className="truncate text-muted">{vehicle.make} {vehicle.model}</span>
                                                <span
                                                    className="shrink-0 font-bold tabular-nums"
                                                    style={{ color: low ? '#a55320' : '#183f35' }}
                                                >
                                                    {assessed ? `${vehicle.healthScore}%` : '—'}
                                                </span>
                                            </div>
                                            <div className="h-1.5 overflow-hidden rounded-full bg-sand">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: assessed ? `${vehicle.healthScore}%` : '0%' }}
                                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: low ? '#c76b32' : '#183f35' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Loyalty + spend */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="panel p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-forest-pale">
                                <Star size={16} className="text-primary" aria-hidden="true" />
                            </div>
                            <h3 className="font-bold text-ink">Loyalty points</h3>
                        </div>
                        <p className="mb-1 text-4xl font-semibold text-primary">
                            {points.toLocaleString('en-IN')} <span className="text-lg font-normal text-muted">pts</span>
                        </p>
                        <p className="mb-4 text-xs text-muted">
                            Earned on {formatRupees(view.totalSpend)} of completed work · 1,000 pts = ₹500
                        </p>
                        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-sand">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${Math.min(100, Math.round(((points % POINTS_PER_TIER) / POINTS_PER_TIER) * 100))}%` }}
                            />
                        </div>
                        <p className="text-xs text-faint">
                            {(POINTS_PER_TIER - (points % POINTS_PER_TIER)).toLocaleString('en-IN')} pts to the next reward tier
                        </p>
                    </div>

                    <div className="panel p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-forest-pale">
                                <TrendingUp size={16} className="text-primary" aria-hidden="true" />
                            </div>
                            <h3 className="font-bold text-ink">Total spent with us</h3>
                        </div>
                        <p className="mb-1 text-4xl font-semibold text-ink">{formatRupees(view.totalSpend)}</p>
                        <p className="mb-4 text-xs text-muted">
                            Across {view.visits} service visit{view.visits === 1 ? '' : 's'}
                        </p>
                        {mix.length === 0 ? (
                            <p className="text-xs text-muted">No completed services yet.</p>
                        ) : (
                            <dl className="space-y-1.5">
                                {mix.map(slice => (
                                    <div key={slice.name} className="flex items-center gap-3 text-xs">
                                        <dt className="w-28 shrink-0 truncate text-muted">{slice.name}</dt>
                                        <dd className="flex min-w-0 flex-1 items-center gap-3">
                                            <span className="h-1 flex-1 overflow-hidden rounded-full bg-sand">
                                                <span className="block h-full rounded-full bg-primary" style={{ width: `${slice.pct}%` }} />
                                            </span>
                                            <span className="w-8 shrink-0 text-right text-muted">{slice.pct}%</span>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderVehicles = () => (
        <motion.div key="vehicles" {...fade} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-ink">My garage</h2>
                    <p className="mt-0.5 text-xs text-muted">
                        {view.vehicles.length} vehicle{view.vehicles.length === 1 ? '' : 's'} on record
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setDialog({ kind: 'check' })}
                        className="btn-secondary px-4 py-2 text-sm"
                    >
                        <Sparkles size={14} aria-hidden="true" /> AI vehicle check
                    </button>
                    <button
                        type="button"
                        onClick={() => setDialog({ kind: 'vehicle-form', vehicle: null })}
                        className="btn-primary px-4 py-2 text-sm"
                    >
                        <Plus size={14} aria-hidden="true" /> Add vehicle
                    </button>
                </div>
            </div>

            {view.vehicles.length === 0 ? (
                <div className="panel">
                    <EmptyState
                        icon={Car}
                        title="No vehicles yet"
                        message="Add a car and the dashboard tracks its service intervals, insurance and history."
                        action={
                            <button
                                type="button"
                                onClick={() => setDialog({ kind: 'vehicle-form', vehicle: null })}
                                className="btn-primary px-5 py-2.5 text-sm"
                            >
                                <Plus size={14} aria-hidden="true" /> Add your first vehicle
                            </button>
                        }
                    />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {view.vehicles.map(vehicle => (
                        <div key={vehicle.id} className="space-y-2">
                            <VehicleCard
                                vehicle={vehicle}
                                onView={v => setDialog({ kind: 'vehicle-details', vehicle: v })}
                                onBook={v => openBooking(v.id)}
                                onCheck={v => setDialog({ kind: 'check', vehicleId: v.id })}
                            />
                            <div className="flex justify-end gap-3 px-1">
                                <button
                                    type="button"
                                    onClick={() => setDialog({ kind: 'vehicle-form', vehicle })}
                                    className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
                                >
                                    <Pencil size={12} aria-hidden="true" />
                                    Edit<span className="sr-only"> {vehicleLabel(vehicle)}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDialog({ kind: 'vehicle-remove', vehicle })}
                                    className="flex items-center gap-1.5 text-xs text-clay-ink transition-colors hover:underline"
                                >
                                    <Trash2 size={12} aria-hidden="true" />
                                    Remove<span className="sr-only"> {vehicleLabel(vehicle)}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Recommendations, from this garage's own record */}
            <div className="panel p-6">
                <h3 className="mb-1 flex items-center gap-2 font-bold text-ink">
                    <BadgeCheck size={16} className="text-primary" aria-hidden="true" /> Recommendations
                </h3>
                <p className="mb-4 text-xs text-muted">
                    Drawn from your service record, not a seasonal calendar.
                </p>
                {recommendations.length === 0 ? (
                    <EmptyState
                        className="py-8"
                        icon={CheckCircle2}
                        title="Nothing needs attention"
                        message="Every vehicle in your garage is inside its interval with cover in date."
                    />
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {recommendations.map(rec => (
                            <li key={rec.id}>
                                <button
                                    type="button"
                                    onClick={() => setDialog({ kind: 'recommendation', recommendation: rec })}
                                    className="flex h-full w-full items-start gap-3 rounded-sm border border-line bg-sand p-4 text-left transition-all hover:border-forest hover:bg-forest-pale"
                                >
                                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${rec.priority === 'Routine' ? 'bg-forest-pale' : 'bg-clay-pale'}`}>
                                        {rec.priority === 'Routine'
                                            ? <ShieldCheck size={16} className="text-primary" aria-hidden="true" />
                                            : <AlertTriangle size={16} className="text-clay-ink" aria-hidden="true" />}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium text-ink">{rec.title}</span>
                                        <span className="mt-0.5 block text-xs text-muted">{rec.vehicleLabel}</span>
                                        <span className="mt-1 block text-xs text-muted">{rec.summary}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </motion.div>
    );

    const renderHistory = () => (
        <motion.div key="history" {...fade} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-ink">Service history</h2>
                    <p className="mt-0.5 text-xs text-muted">
                        {view.visits} completed service{view.visits === 1 ? '' : 's'} · {formatRupees(view.totalSpend)} spent
                    </p>
                </div>
                <button
                    type="button"
                    onClick={exportHistory}
                    disabled={view.records.length === 0}
                    className="btn-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Download size={14} aria-hidden="true" /> Download all
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total services" value={view.visits} />
                <StatCard
                    label="Average rating given"
                    value={view.averageRating === null ? '—' : `${view.averageRating.toFixed(1)} ★`}
                />
                <StatCard label="Amount spent" value={formatRupees(view.totalSpend)} />
            </div>

            <div className="panel p-4 sm:p-6">
                {view.records.length === 0 ? (
                    <EmptyState
                        icon={Wrench}
                        title="No services on record"
                        message="Completed work appears here with its invoice and the readings taken."
                        action={
                            <button type="button" onClick={() => openBooking()} className="btn-primary px-5 py-2.5 text-sm">
                                Book your first service
                            </button>
                        }
                    />
                ) : (
                    // `relative` is load-bearing: the sr-only labels inside the
                    // table are absolutely positioned, and without a containing
                    // block here they escaped this scroller's clip and gave the
                    // whole page a few hundred px of sideways scroll on a phone.
                    <div className="relative -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                        <table className="w-full min-w-[46rem] text-sm">
                            <caption className="sr-only">Completed services, most recent first</caption>
                            <thead>
                                <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-faint">
                                    <th scope="col" className="pb-3 text-left">Service ID</th>
                                    <th scope="col" className="pb-3 text-left">Service</th>
                                    <th scope="col" className="pb-3 text-left">Vehicle</th>
                                    <th scope="col" className="pb-3 text-left">Date</th>
                                    <th scope="col" className="pb-3 text-left">Technician</th>
                                    <th scope="col" className="pb-3 text-right">Cost</th>
                                    <th scope="col" className="pb-3 text-center">Rating</th>
                                    <th scope="col" className="pb-3 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {view.records.map(record => (
                                    <tr key={record.id} className="border-b border-line transition-colors hover:bg-sand">
                                        <td className="py-3 font-mono text-xs text-primary">{record.id}</td>
                                        <td className="py-3 font-medium text-ink">{record.serviceName}</td>
                                        <td className="py-3 text-muted">
                                            {vehicleLabel(view.vehicles.find(v => v.id === record.vehicleId))}
                                        </td>
                                        <td className="py-3 whitespace-nowrap text-muted">{formatDate(record.completedOn)}</td>
                                        <td className="py-3 text-muted">{record.technician}</td>
                                        <td className="py-3 text-right font-semibold text-ink">{formatRupees(record.cost)}</td>
                                        <td className="py-3 text-center">
                                            {record.rating === null ? (
                                                <span className="text-xs text-faint">—</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-0.5" aria-label={`${record.rating} out of 5`}>
                                                    {Array.from({ length: record.rating }).map((_, i) => (
                                                        <Star key={i} size={11} className="fill-clay text-clay-ink" aria-hidden="true" />
                                                    ))}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setDialog({ kind: 'record', record })}
                                                className="rounded-sm bg-sand px-3 py-1 text-xs text-muted transition-colors hover:bg-forest-pale hover:text-primary"
                                            >
                                                View<span className="sr-only"> receipt {record.invoiceId}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderAppointments = () => (
        <motion.div key="appointments" {...fade} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-ink">My appointments</h2>
                    <p className="mt-0.5 text-xs text-muted">
                        {view.upcoming.length} open · {view.pastBookings.length} past
                    </p>
                </div>
                <button type="button" onClick={() => openBooking()} className="btn-primary px-4 py-2 text-sm">
                    <Plus size={14} aria-hidden="true" /> Book new
                </button>
            </div>

            <section className="space-y-4">
                <h3 className="text-sm font-bold text-ink">Upcoming</h3>
                {view.upcoming.length === 0 ? (
                    <div className="panel">
                        <EmptyState
                            icon={CalendarCheck}
                            title="Nothing booked"
                            message="Book a service and it appears here with its bay and technician once an advisor confirms it."
                            action={
                                <button type="button" onClick={() => openBooking()} className="btn-primary px-5 py-2.5 text-sm">
                                    Book a service
                                </button>
                            }
                        />
                    </div>
                ) : (
                    view.upcoming.map(booking => {
                        const vehicle = view.vehicles.find(v => v.id === booking.vehicleId);
                        return (
                            <div key={booking.id} className="panel p-5 transition-colors hover:border-forest sm:p-6">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-forest-pale">
                                            <Wrench size={20} className="text-primary" aria-hidden="true" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-ink">{booking.serviceName}</p>
                                            <p className="mt-0.5 text-xs text-muted">
                                                {booking.id} · {formatDate(booking.scheduledFor)} · {booking.slot}
                                            </p>
                                            <p className="mt-1 text-xs text-muted">
                                                {vehicleLabel(vehicle)}
                                                {vehicle ? ` · ${vehicle.registration}` : ''}
                                                {booking.bay ? ` · ${booking.bay}` : ' · bay to be assigned'}
                                                {booking.technician ? ` · ${booking.technician}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                                        <StatusBadge status={booking.status} size="sm" />
                                        <button
                                            type="button"
                                            onClick={() => setDialog({ kind: 'booking-details', booking })}
                                            className="btn-secondary px-4 py-2 text-xs"
                                        >
                                            Details<span className="sr-only"> for {booking.id}</span>
                                        </button>
                                        {CANCELLABLE_STATUSES.includes(booking.status) && (
                                            <button
                                                type="button"
                                                onClick={() => setDialog({ kind: 'booking-cancel', booking })}
                                                className="text-xs text-clay-ink hover:underline"
                                            >
                                                Cancel<span className="sr-only"> {booking.id}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {view.pastBookings.length > 0 && (
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-ink">Past</h3>
                    <ul className="panel divide-y divide-line">
                        {view.pastBookings.map(booking => (
                            <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-ink">{booking.serviceName}</p>
                                    <p className="text-xs text-muted">
                                        {booking.id} · {formatDate(booking.scheduledFor)} ·{' '}
                                        {vehicleLabel(view.vehicles.find(v => v.id === booking.vehicleId))}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    <StatusBadge status={booking.status} size="sm" />
                                    <button
                                        type="button"
                                        onClick={() => setDialog({ kind: 'booking-details', booking })}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Details<span className="sr-only"> for {booking.id}</span>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Quick book */}
            <div className="panel p-6">
                <h3 className="mb-4 font-bold text-ink">Quick book a service</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {SERVICE_OPTIONS.map(option => (
                        <button
                            key={option.slug}
                            type="button"
                            onClick={() => openBooking(undefined, option.slug)}
                            className="group flex flex-col items-center gap-2 rounded-sm border border-line bg-sand p-4 text-center transition-all hover:border-forest hover:bg-forest-pale"
                        >
                            <Wrench size={18} className="text-muted transition-colors group-hover:text-primary" aria-hidden="true" />
                            <span className="text-xs text-muted group-hover:text-ink">{option.name}</span>
                            <span className="text-[10px] text-faint">from {formatRupees(option.fromPrice)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderInvoices = () => {
        const invoiced = view.records;
        const total = view.totalSpend;

        return (
            <motion.div key="invoices" {...fade} className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-ink">Invoices</h2>
                        <p className="mt-0.5 text-xs text-muted">
                            {invoiced.length} invoice{invoiced.length === 1 ? '' : 's'} · nothing outstanding
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={exportHistory}
                        disabled={invoiced.length === 0}
                        className="btn-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Download size={14} aria-hidden="true" /> Export all
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard icon={CreditCard} label="Total paid" value={formatRupees(total)} />
                    <StatCard icon={FileText} label="Invoices" value={invoiced.length} />
                    <StatCard icon={CheckCircle2} label="Outstanding" value={formatRupees(0)} />
                </div>

                <div className="panel p-4 sm:p-6">
                    {invoiced.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="No invoices yet"
                            message="Each completed service produces an itemised invoice you can download here."
                        />
                    ) : (
                        <>
                            <div className="relative -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                                <table className="w-full min-w-[40rem] text-sm">
                                    <caption className="sr-only">Invoices, most recent first</caption>
                                    <thead>
                                        <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-faint">
                                            <th scope="col" className="pb-3 text-left">Invoice</th>
                                            <th scope="col" className="pb-3 text-left">Service</th>
                                            <th scope="col" className="pb-3 text-left">Vehicle</th>
                                            <th scope="col" className="pb-3 text-left">Date</th>
                                            <th scope="col" className="pb-3 text-right">Amount</th>
                                            <th scope="col" className="pb-3 text-right">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiced.map(record => (
                                            <tr key={record.invoiceId} className="border-b border-line transition-colors hover:bg-sand">
                                                <td className="py-3 font-mono text-xs text-primary">{record.invoiceId}</td>
                                                <td className="py-3 font-medium text-ink">{record.serviceName}</td>
                                                <td className="py-3 text-muted">
                                                    {vehicleLabel(view.vehicles.find(v => v.id === record.vehicleId))}
                                                </td>
                                                <td className="py-3 whitespace-nowrap text-muted">{formatDate(record.completedOn)}</td>
                                                <td className="py-3 text-right font-bold text-ink">{formatRupees(record.cost)}</td>
                                                <td className="py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDialog({ kind: 'record', record })}
                                                        className="rounded-sm bg-sand px-3 py-1 text-xs text-muted transition-colors hover:bg-forest-pale hover:text-primary"
                                                    >
                                                        View<span className="sr-only"> invoice {record.invoiceId}</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                                <span className="text-xs text-faint">
                                    {invoiced.length} invoice{invoiced.length === 1 ? '' : 's'}
                                </span>
                                <span className="text-sm font-bold text-ink">
                                    Total: <span className="text-primary">{formatRupees(total)}</span>
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderSettings = () => (
        <motion.div key="settings" {...fade}>
            <AccountSettings
                customer={customer}
                visits={view.visits}
                onResetWorkshop={resetWorkshop}
            />
        </motion.div>
    );

    const sections: Record<string, () => React.ReactNode> = {
        Dashboard: renderDashboard,
        'My Vehicles': renderVehicles,
        'Service History': renderHistory,
        Appointments: renderAppointments,
        Invoices: renderInvoices,
        Settings: renderSettings,
    };

    return (
        <div className="bg-paper">
            <DashboardTabs
                tabs={tabs}
                active={tab}
                onChange={setTab}
                idPrefix="user"
                actions={
                    <button
                        type="button"
                        onClick={() => openBooking()}
                        className="btn-primary px-4 py-2 text-xs"
                    >
                        <Plus size={12} aria-hidden="true" /> Book service
                    </button>
                }
            />

            <div
                {...dashboardPanelProps('user', tab)}
                className="mx-auto max-w-7xl px-4 py-6 pb-12"
            >
                <AnimatePresence mode="wait">
                    {sections[tab]?.()}
                </AnimatePresence>
            </div>

            {/* ── Dialogs ──────────────────────────────────────── */}

            {dialog.kind === 'vehicle-form' && (
                <VehicleFormDialog
                    open onClose={close}
                    vehicle={dialog.vehicle}
                    ownerId={CURRENT_CUSTOMER_ID}
                />
            )}

            {dialog.kind === 'vehicle-details' && (
                <VehicleDetailsDialog
                    open onClose={close}
                    vehicle={dialog.vehicle}
                    onEdit={vehicle => setDialog({ kind: 'vehicle-form', vehicle })}
                    onBook={vehicle => openBooking(vehicle.id)}
                    onCheck={vehicle => setDialog({ kind: 'check', vehicleId: vehicle.id })}
                    onRemove={vehicle => setDialog({ kind: 'vehicle-remove', vehicle })}
                />
            )}

            {dialog.kind === 'vehicle-remove' && (
                <ConfirmDialog
                    open onClose={close}
                    tone="danger"
                    title="Remove this vehicle?"
                    confirmLabel="Remove vehicle"
                    message={
                        <>
                            <strong className="font-semibold text-ink">
                                {vehicleLabel(dialog.vehicle)} · {dialog.vehicle.registration}
                            </strong>{' '}
                            will be taken off your garage, and any booking still open against it
                            will be cancelled. Completed services stay on your history.
                        </>
                    }
                    onConfirm={() => confirmRemoveVehicle(dialog.vehicle)}
                />
            )}

            {dialog.kind === 'booking-form' && (
                <BookingFormDialog
                    open onClose={close}
                    vehicles={view.vehicles}
                    customerId={CURRENT_CUSTOMER_ID}
                    presetVehicleId={dialog.vehicleId}
                    presetServiceSlug={dialog.serviceSlug}
                    presetNotes={dialog.notes}
                />
            )}

            {dialog.kind === 'booking-details' && (
                <BookingDetailsDialog
                    open onClose={close}
                    booking={dialog.booking}
                    onCancel={booking => setDialog({ kind: 'booking-cancel', booking })}
                />
            )}

            {dialog.kind === 'booking-cancel' && (
                <ConfirmDialog
                    open onClose={close}
                    tone="danger"
                    title="Cancel this booking?"
                    confirmLabel="Cancel booking"
                    cancelLabel="Keep it"
                    message={
                        <>
                            <strong className="font-semibold text-ink">
                                {dialog.booking.serviceName}
                            </strong>{' '}
                            on {formatDate(dialog.booking.scheduledFor)} at {dialog.booking.slot} will be
                            called off. Nothing has been charged, and you can book again at any time.
                        </>
                    }
                    onConfirm={() => confirmCancelBooking(dialog.booking)}
                />
            )}

            {dialog.kind === 'check' && (
                <VehicleCheckDialog
                    open onClose={close}
                    vehicles={view.vehicles}
                    presetVehicleId={dialog.vehicleId}
                    onBook={openBooking}
                />
            )}

            {dialog.kind === 'record' && (
                <ServiceRecordDialog open onClose={close} record={dialog.record} />
            )}

            {dialog.kind === 'recommendation' && (
                <RecommendationDialog
                    open onClose={close}
                    recommendation={dialog.recommendation}
                    onBook={openBooking}
                />
            )}
        </div>
    );
};

export default UserDashboard;
