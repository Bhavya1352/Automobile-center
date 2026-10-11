import React from 'react';
import { Car, Wrench, CalendarCheck, Mail, Phone, MapPin, Pencil } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/DataState';
import { useCustomerView, vehicleLabel } from '../../hooks/useWorkshop';
import { formatDate, formatKm, formatRupees } from '../../lib/format';
import type { Customer } from '../../types/workshop';

interface CustomerDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    customer: Customer | null;
    onEdit: (customer: Customer) => void;
    onNewBooking: (customer: Customer) => void;
}

const Section: React.FC<{
    title: string;
    icon: React.ComponentType<{ size?: number | string; className?: string }>;
    children: React.ReactNode;
}> = ({ title, icon: Icon, children }) => (
    <section>
        <h3 className="mb-3 flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
            <Icon size={15} className="text-primary" />
            {title}
        </h3>
        {children}
    </section>
);

/**
 * CustomerDetailsDialog — one customer's whole file.
 *
 * Contact details, the cars on record, open jobs and completed work,
 * all derived through useCustomerView — the same selector the owner's
 * own dashboard uses, so an advisor and a customer looking at the same
 * account see the same totals.
 */
export const CustomerDetailsDialog: React.FC<CustomerDetailsDialogProps> = ({
    open, onClose, customer, onEdit, onNewBooking,
}) => {
    const view = useCustomerView(customer?.id ?? null);
    if (!customer) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="lg"
            title={customer.name}
            description={`Customer since ${formatDate(customer.joinedOn)} · ${customer.plan} plan`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-[0.875rem] sm:mr-auto">
                        Close
                    </button>
                    <button type="button" onClick={() => onEdit(customer)} className="btn-secondary px-4 py-2.5 text-[0.875rem]">
                        <Pencil size={14} aria-hidden="true" /> Edit details
                    </button>
                    <button type="button" onClick={() => onNewBooking(customer)} className="btn-primary px-4 py-2.5 text-[0.875rem]">
                        New booking
                    </button>
                </>
            }
        >
            <div className="space-y-7">
                {/* Contact + standing */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <dl className="space-y-2.5 text-[0.875rem]">
                        <div className="flex items-center gap-2.5">
                            <dt className="sr-only">Email</dt>
                            <Mail size={14} className="shrink-0 text-muted" aria-hidden="true" />
                            <dd className="min-w-0 truncate text-ink">{customer.email}</dd>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <dt className="sr-only">Phone</dt>
                            <Phone size={14} className="shrink-0 text-muted" aria-hidden="true" />
                            <dd className="text-ink">{customer.phone}</dd>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <dt className="sr-only">City</dt>
                            <MapPin size={14} className="shrink-0 text-muted" aria-hidden="true" />
                            <dd className="text-ink">{customer.city}</dd>
                        </div>
                    </dl>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="border border-line bg-sand px-2 py-3">
                            <p className="text-lg font-bold text-primary">{view.visits}</p>
                            <p className="text-[0.6875rem] text-muted">Visits</p>
                        </div>
                        <div className="border border-line bg-sand px-2 py-3">
                            <p className="text-lg font-bold text-primary">{formatRupees(view.totalSpend)}</p>
                            <p className="text-[0.6875rem] text-muted">Spent</p>
                        </div>
                        <div className="border border-line bg-sand px-2 py-3">
                            <p className="text-lg font-bold text-primary">
                                {view.averageRating === null ? '—' : view.averageRating.toFixed(1)}
                            </p>
                            <p className="text-[0.6875rem] text-muted">Avg. rating</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={customer.status} size="sm" />
                    <StatusBadge status={customer.plan} size="sm" />
                    <span className="text-xs text-muted">
                        Last visit {formatDate(view.lastVisitOn)}
                    </span>
                </div>

                {/* Vehicles */}
                <Section title={`Vehicles (${view.vehicles.length})`} icon={Car}>
                    {view.vehicles.length === 0 ? (
                        <p className="text-[0.875rem] text-muted">No vehicles on this account.</p>
                    ) : (
                        <ul className="divide-y divide-line border-y border-line">
                            {view.vehicles.map(vehicle => (
                                <li key={vehicle.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                                    <div className="min-w-0">
                                        <p className="text-[0.875rem] font-medium text-ink">
                                            {vehicleLabel(vehicle)}
                                            {vehicle.variant ? ` · ${vehicle.variant}` : ''}
                                        </p>
                                        <p className="text-xs text-muted">
                                            {vehicle.registration} · {vehicle.fuel} · {formatKm(vehicle.odometerKm)}
                                        </p>
                                    </div>
                                    <StatusBadge status={vehicle.status} size="sm" />
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>

                {/* Open jobs */}
                <Section title={`Current and upcoming (${view.upcoming.length})`} icon={CalendarCheck}>
                    {view.upcoming.length === 0 ? (
                        <p className="text-[0.875rem] text-muted">Nothing booked in.</p>
                    ) : (
                        <ul className="space-y-2">
                            {view.upcoming.map(booking => (
                                <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 bg-sand px-4 py-3">
                                    <div className="min-w-0">
                                        <p className="text-[0.875rem] font-medium text-ink">{booking.serviceName}</p>
                                        <p className="text-xs text-muted">
                                            {booking.id} · {formatDate(booking.scheduledFor)} · {booking.slot}
                                            {booking.bay ? ` · ${booking.bay}` : ' · no bay'}
                                            {booking.technician ? ` · ${booking.technician}` : ''}
                                        </p>
                                    </div>
                                    <StatusBadge status={booking.status} size="sm" />
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>

                {/* History */}
                <Section title={`Service history (${view.records.length})`} icon={Wrench}>
                    {view.records.length === 0 ? (
                        <EmptyState
                            className="py-8"
                            title="No completed work"
                            message="This account has no invoiced services yet."
                        />
                    ) : (
                        <div className="-mx-1 overflow-x-auto px-1">
                            <table className="w-full min-w-[32rem] text-[0.875rem]">
                                <caption className="sr-only">Completed services for {customer.name}</caption>
                                <thead>
                                    <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-faint">
                                        <th scope="col" className="pb-2 text-left">Service</th>
                                        <th scope="col" className="pb-2 text-left">Date</th>
                                        <th scope="col" className="pb-2 text-left">Technician</th>
                                        <th scope="col" className="pb-2 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {view.records.map(record => (
                                        <tr key={record.id} className="border-b border-line">
                                            <td className="py-2.5 font-medium text-ink">{record.serviceName}</td>
                                            <td className="py-2.5 whitespace-nowrap text-muted">{formatDate(record.completedOn)}</td>
                                            <td className="py-2.5 text-muted">{record.technician}</td>
                                            <td className="py-2.5 text-right font-semibold text-ink">{formatRupees(record.cost)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Section>
            </div>
        </Modal>
    );
};
