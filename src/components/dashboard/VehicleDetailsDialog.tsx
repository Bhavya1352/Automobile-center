import React, { useMemo } from 'react';
import { Wrench, CalendarCheck, Sparkles, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/DataState';
import { useWorkshop } from '../../hooks/useWorkshop';
import { formatDate, formatKm, formatRupees } from '../../lib/format';
import { CANCELLABLE_STATUSES } from '../../types/workshop';
import type { OwnedVehicle } from '../../types/workshop';

interface VehicleDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    vehicle: OwnedVehicle | null;
    onEdit: (vehicle: OwnedVehicle) => void;
    onBook: (vehicle: OwnedVehicle) => void;
    onCheck: (vehicle: OwnedVehicle) => void;
    onRemove: (vehicle: OwnedVehicle) => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 last:border-0">
        <dt className="text-[0.8125rem] text-muted">{label}</dt>
        <dd className="text-right text-[0.875rem] font-medium text-ink">{children}</dd>
    </div>
);

/**
 * VehicleDetailsDialog — everything the owner's record holds about one
 * car, and every action they can take on it, in one place.
 *
 * The service history and open jobs are read from the workshop context
 * rather than passed in, so the modal cannot show a stale list after a
 * booking is cancelled behind it.
 */
export const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({
    open, onClose, vehicle, onEdit, onBook, onCheck, onRemove,
}) => {
    const { bookings, records } = useWorkshop();

    const history = useMemo(
        () => records
            .filter(r => r.vehicleId === vehicle?.id)
            .sort((a, b) => b.completedOn.localeCompare(a.completedOn)),
        [records, vehicle?.id],
    );

    const openJobs = useMemo(
        () => bookings
            .filter(b => b.vehicleId === vehicle?.id
                && (CANCELLABLE_STATUSES.includes(b.status) || b.status === 'In Service'))
            .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)),
        [bookings, vehicle?.id],
    );

    if (!vehicle) return null;

    const dueIn = vehicle.nextServiceKm - vehicle.odometerKm;

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="lg"
            title={`${vehicle.make} ${vehicle.model}`}
            description={[vehicle.variant, vehicle.year, vehicle.registration]
                .filter(Boolean).join(' · ')}
            footer={
                <>
                    <button
                        type="button"
                        onClick={() => onRemove(vehicle)}
                        className="btn-secondary px-4 py-2.5 text-[0.875rem] text-clay-ink sm:mr-auto"
                    >
                        <Trash2 size={14} aria-hidden="true" /> Remove
                    </button>
                    <button type="button" onClick={() => onCheck(vehicle)} className="btn-secondary px-4 py-2.5 text-[0.875rem]">
                        <Sparkles size={14} aria-hidden="true" /> AI check
                    </button>
                    <button type="button" onClick={() => onEdit(vehicle)} className="btn-secondary px-4 py-2.5 text-[0.875rem]">
                        <Pencil size={14} aria-hidden="true" /> Edit
                    </button>
                    <button type="button" onClick={() => onBook(vehicle)} className="btn-primary px-4 py-2.5 text-[0.875rem]">
                        Book service
                    </button>
                </>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <dl>
                        <Row label="Status"><StatusBadge status={vehicle.status} size="sm" /></Row>
                        <Row label="Odometer">{formatKm(vehicle.odometerKm)}</Row>
                        <Row label="Fuel">{vehicle.fuel}</Row>
                        <Row label="Next service">
                            {formatKm(vehicle.nextServiceKm)}
                            <span className={dueIn <= 1000 ? 'ml-1 text-clay-ink' : 'ml-1 text-muted'}>
                                ({dueIn > 0 ? `in ${formatKm(dueIn)}` : 'overdue'})
                            </span>
                        </Row>
                    </dl>
                    <dl>
                        <Row label="Last service">{formatDate(vehicle.lastServiceOn)}</Row>
                        <Row label="Insurance valid till">{formatDate(vehicle.insuranceValidTill)}</Row>
                        <Row label="Warranty">
                            {vehicle.warrantyValidTill
                                ? `Until ${formatDate(vehicle.warrantyValidTill)}`
                                : <span className="text-clay-ink">Expired</span>}
                        </Row>
                        <Row label="Health score">
                            {vehicle.lastServiceOn
                                ? `${vehicle.healthScore}%`
                                : <span className="text-muted">Not yet assessed</span>}
                        </Row>
                    </dl>
                </div>

                <section>
                    <h3 className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
                        <CalendarCheck size={15} className="text-primary" aria-hidden="true" />
                        Upcoming service
                    </h3>
                    {openJobs.length === 0 ? (
                        <p className="mt-2 text-[0.875rem] text-muted">
                            Nothing booked for this vehicle.
                        </p>
                    ) : (
                        <ul className="mt-3 space-y-2">
                            {openJobs.map(job => (
                                <li key={job.id} className="flex flex-wrap items-center justify-between gap-3 bg-sand px-4 py-3">
                                    <div className="min-w-0">
                                        <p className="text-[0.875rem] font-medium text-ink">{job.serviceName}</p>
                                        <p className="text-xs text-muted">
                                            {job.id} · {formatDate(job.scheduledFor)} · {job.slot}
                                            {job.bay ? ` · ${job.bay}` : ' · bay to be assigned'}
                                        </p>
                                    </div>
                                    <StatusBadge status={job.status} size="sm" />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section>
                    <h3 className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
                        <Wrench size={15} className="text-primary" aria-hidden="true" />
                        Service history
                    </h3>
                    {history.length === 0 ? (
                        <EmptyState
                            className="py-8"
                            title="No work on record"
                            message="Completed services for this vehicle will be listed here with their invoices."
                        />
                    ) : (
                        <ul className="mt-3 divide-y divide-line border-y border-line">
                            {history.map(record => (
                                <li key={record.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                                    <div className="min-w-0">
                                        <p className="text-[0.875rem] font-medium text-ink">{record.serviceName}</p>
                                        <p className="text-xs text-muted">
                                            {formatDate(record.completedOn)} · {formatKm(record.odometerKm)} · {record.technician}
                                        </p>
                                    </div>
                                    <p className="text-[0.875rem] font-semibold text-ink">{formatRupees(record.cost)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </Modal>
    );
};
