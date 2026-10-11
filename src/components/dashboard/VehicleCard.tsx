import React from 'react';
import { Car, Sparkles } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate, formatKm } from '../../lib/format';
import type { OwnedVehicle } from '../../types/workshop';

interface VehicleCardProps {
    vehicle: OwnedVehicle;
    onView: (vehicle: OwnedVehicle) => void;
    onBook: (vehicle: OwnedVehicle) => void;
    onCheck: (vehicle: OwnedVehicle) => void;
}

/**
 * VehicleCard — one car in the owner's garage.
 *
 * Presentational: it formats its own values and nothing else. Every
 * action is handed up, so the card does not know whether removing a
 * vehicle takes a confirmation or what the toast afterwards says.
 *
 * A car we have never inspected shows no health score. Inventing 75%
 * for it would be the kind of plausible-looking number that makes the
 * rest of the figures untrustworthy.
 */
export const VehicleCard: React.FC<VehicleCardProps> = ({
    vehicle, onView, onBook, onCheck,
}) => {
    const assessed = Boolean(vehicle.lastServiceOn);
    const dueIn = vehicle.nextServiceKm - vehicle.odometerKm;

    const rows: { label: string; value: React.ReactNode }[] = [
        { label: 'Registration', value: vehicle.registration },
        { label: 'Odometer', value: formatKm(vehicle.odometerKm) },
        {
            label: 'Next service',
            value: (
                <>
                    {formatKm(vehicle.nextServiceKm)}
                    <span className={dueIn <= 0 ? ' text-clay-ink' : ' text-muted'}>
                        {dueIn > 0 ? ` · in ${formatKm(dueIn)}` : ' · overdue'}
                    </span>
                </>
            ),
        },
        { label: 'Last service', value: formatDate(vehicle.lastServiceOn) },
        {
            label: 'Insurance',
            value: vehicle.insuranceValidTill
                ? formatDate(vehicle.insuranceValidTill)
                : <span className="text-muted">Not on record</span>,
        },
        {
            label: 'Warranty',
            value: vehicle.warrantyValidTill
                ? `Until ${formatDate(vehicle.warrantyValidTill)}`
                : <span className="text-clay-ink">Expired</span>,
        },
    ];

    return (
        <article className="panel relative overflow-hidden border-line p-6 transition-colors hover:border-forest">
            <Car size={80} className="pointer-events-none absolute -bottom-4 -right-4 text-primary opacity-5" aria-hidden="true" />

            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-ink">{vehicle.make} {vehicle.model}</h3>
                    <p className="truncate text-sm text-primary">
                        {[vehicle.variant, vehicle.year, vehicle.fuel].filter(Boolean).join(' · ')}
                    </p>
                </div>
                <StatusBadge status={vehicle.status} size="sm" className="shrink-0" />
            </div>

            <dl className="space-y-2.5 border-t border-line pt-4 text-sm">
                {rows.map(row => (
                    <div key={row.label} className="flex items-baseline justify-between gap-3">
                        <dt className="shrink-0 text-muted">{row.label}</dt>
                        <dd className="truncate text-right font-medium text-ink">{row.value}</dd>
                    </div>
                ))}
            </dl>

            <div className="mt-5 border-t border-line pt-4">
                <div className="mb-1.5 flex justify-between text-xs text-muted">
                    <span>Vehicle health score</span>
                    <span className={assessed ? 'font-bold text-primary' : 'text-faint'}>
                        {assessed ? `${vehicle.healthScore}%` : 'Not yet assessed'}
                    </span>
                </div>
                {/* A meter has to carry a value, so an unassessed car gets a
                    plain bar the figure beside it already explains. */}
                <div
                    className="h-1.5 overflow-hidden rounded-full bg-sand"
                    {...(assessed ? {
                        role: 'meter',
                        'aria-valuenow': vehicle.healthScore,
                        'aria-valuemin': 0,
                        'aria-valuemax': 100,
                        'aria-label': `Health score for ${vehicle.make} ${vehicle.model}`,
                    } : { 'aria-hidden': true })}
                >
                    <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: assessed ? `${vehicle.healthScore}%` : '0%' }}
                    />
                </div>
            </div>

            {/* py-2.5 so the row clears 40px, and 44px under the coarse
                pointer floor in the stylesheet. */}
            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => onView(vehicle)}
                    className="btn-secondary flex-1 px-3 py-2.5 text-xs"
                >
                    View details
                </button>
                <button
                    type="button"
                    onClick={() => onCheck(vehicle)}
                    className="btn-secondary px-3 py-2.5 text-xs"
                    aria-label={`Run the AI vehicle check on the ${vehicle.make} ${vehicle.model}`}
                >
                    <Sparkles size={13} aria-hidden="true" /> AI check
                </button>
                <button
                    type="button"
                    onClick={() => onBook(vehicle)}
                    className="btn-primary flex-1 px-3 py-2.5 text-xs"
                >
                    Book service
                </button>
            </div>
        </article>
    );
};
