/**
 * Recommendations shown on the owner's garage tab.
 *
 * Derived from the record the workshop already holds — odometer
 * against the next interval, insurance expiry, the last time a given
 * job was done — rather than a marketing list that says the same four
 * things to everybody. If a vehicle has nothing worth flagging, it
 * produces nothing, and the UI says so.
 */

import { formatDate, formatKm } from './format';
import type { OwnedVehicle, ServiceRecord } from '../types/workshop';

export interface Recommendation {
    id: string;
    vehicleId: string;
    vehicleLabel: string;
    title: string;
    /** One line, for the card. */
    summary: string;
    /** The reasoning, for the modal. */
    detail: string;
    /** The evidence this was drawn from. */
    basis: string[];
    priority: 'Urgent' | 'Soon' | 'Routine';
    /** Absent for advisories that are not a bookable job. */
    serviceSlug?: string;
    serviceName?: string;
}

/** Inside this much of the interval, the service is worth raising. */
const SERVICE_WINDOW_KM = 2500;
/** Insurance inside this window is worth a reminder. */
const INSURANCE_WINDOW_DAYS = 60;
/** Brake work is normally due again somewhere around here. */
const BRAKE_INTERVAL_KM = 30000;
/** Below this, the last inspection flagged enough to warrant a look. */
const HEALTH_FLOOR = 70;

const dayDiff = (iso: string) =>
    Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);

export function buildRecommendations(
    vehicles: OwnedVehicle[],
    records: ServiceRecord[],
): Recommendation[] {
    const out: Recommendation[] = [];

    for (const vehicle of vehicles) {
        const label = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
        const mine = records
            .filter(r => r.vehicleId === vehicle.id)
            .sort((a, b) => b.completedOn.localeCompare(a.completedOn));

        /* Service interval */
        const dueIn = vehicle.nextServiceKm - vehicle.odometerKm;
        if (dueIn <= SERVICE_WINDOW_KM) {
            out.push({
                id: `${vehicle.id}-service`,
                vehicleId: vehicle.id,
                vehicleLabel: label,
                title: dueIn <= 0 ? 'Service overdue' : 'Service due soon',
                summary: dueIn <= 0
                    ? `Past the ${formatKm(vehicle.nextServiceKm)} interval`
                    : `Due in ${formatKm(dueIn)} · currently ${formatKm(vehicle.odometerKm)}`,
                detail: dueIn <= 0
                    ? `This vehicle has passed its scheduled interval of ${formatKm(vehicle.nextServiceKm)}. Running past an oil interval is the single most common cause of the wear we see on cars of this age, and a lapsed record also costs you the warranty protection a documented service gives you.`
                    : `The next scheduled service falls at ${formatKm(vehicle.nextServiceKm)}, which is ${formatKm(dueIn)} away at the current reading. Booking now rather than at the interval means you choose the date.`,
                basis: [
                    `Odometer at ${formatKm(vehicle.odometerKm)}`,
                    `Interval set at ${formatKm(vehicle.nextServiceKm)}`,
                    mine[0]
                        ? `Last visit ${mine[0].serviceName}, ${formatDate(mine[0].completedOn)}`
                        : 'No service recorded with us for this vehicle',
                ],
                priority: dueIn <= 0 ? 'Urgent' : 'Soon',
                serviceSlug: 'periodic-maintenance',
                serviceName: 'Periodic Maintenance',
            });
        }

        /* Insurance */
        if (vehicle.insuranceValidTill) {
            const days = dayDiff(vehicle.insuranceValidTill);
            if (days <= INSURANCE_WINDOW_DAYS) {
                out.push({
                    id: `${vehicle.id}-insurance`,
                    vehicleId: vehicle.id,
                    vehicleLabel: label,
                    title: days < 0 ? 'Insurance has lapsed' : 'Insurance expiring',
                    summary: days < 0
                        ? `Expired ${formatDate(vehicle.insuranceValidTill)}`
                        : `Expires ${formatDate(vehicle.insuranceValidTill)} · ${days} days`,
                    detail: days < 0
                        ? `The cover on record for ${vehicle.registration} expired on ${formatDate(vehicle.insuranceValidTill)}. Driving uninsured is an offence under the Motor Vehicles Act, and a lapse of more than 90 days usually costs you your no-claim bonus as well.`
                        : `The cover on record for ${vehicle.registration} runs out on ${formatDate(vehicle.insuranceValidTill)}. Renewing before it lapses keeps your no-claim bonus intact.`,
                    basis: [
                        `Policy expiry on record: ${formatDate(vehicle.insuranceValidTill)}`,
                        `Registration ${vehicle.registration}`,
                    ],
                    priority: days < 0 ? 'Urgent' : 'Soon',
                });
            }
        }

        /* Brakes */
        const lastBrake = mine.find(r => r.serviceName.toLowerCase().includes('brake'));
        const sinceBrake = lastBrake ? vehicle.odometerKm - lastBrake.odometerKm : null;
        if (lastBrake && sinceBrake !== null && sinceBrake >= BRAKE_INTERVAL_KM) {
            out.push({
                id: `${vehicle.id}-brakes`,
                vehicleId: vehicle.id,
                vehicleLabel: label,
                title: 'Brake inspection worth booking',
                summary: `${formatKm(sinceBrake)} since the last brake work`,
                detail: `The last brake work on this vehicle was ${formatKm(sinceBrake)} ago. Pads rarely last beyond ${formatKm(BRAKE_INTERVAL_KM)} in city use, and discs are measured against the manufacturer's minimum thickness rather than judged by eye — which is the part that cannot be done from the driver's seat.`,
                basis: [
                    `Last brake service at ${formatKm(lastBrake.odometerKm)}, ${formatDate(lastBrake.completedOn)}`,
                    `Now at ${formatKm(vehicle.odometerKm)}`,
                ],
                priority: 'Soon',
                serviceSlug: 'brake-service',
                serviceName: 'Brake Service',
            });
        }

        /* Health score */
        if (vehicle.lastServiceOn && vehicle.healthScore < HEALTH_FLOOR) {
            out.push({
                id: `${vehicle.id}-health`,
                vehicleId: vehicle.id,
                vehicleLabel: label,
                title: 'Health score below par',
                summary: `${vehicle.healthScore}% at the last inspection`,
                detail: `The last inspection put this vehicle at ${vehicle.healthScore}%, which is low enough that something specific was noted rather than general age. A diagnostic session reads live data across the drivetrain and reproduces the fault on the road, so the next repair is quoted against evidence.`,
                basis: [
                    `Health score ${vehicle.healthScore}% (threshold ${HEALTH_FLOOR}%)`,
                    `Assessed ${formatDate(vehicle.lastServiceOn)}`,
                ],
                priority: 'Soon',
                serviceSlug: 'diagnostics',
                serviceName: 'Diagnostics',
            });
        }

        /* Warranty */
        if (!vehicle.warrantyValidTill || dayDiff(vehicle.warrantyValidTill) < 0) {
            out.push({
                id: `${vehicle.id}-warranty`,
                vehicleId: vehicle.id,
                vehicleLabel: label,
                title: 'Out of manufacturer warranty',
                summary: 'Extended cover available for this vehicle',
                detail: `No live manufacturer warranty is on record for this ${label}. Our own workmanship warranty still covers anything we fit for 24 months, and an extended cover plan can be quoted against the vehicle's current condition rather than its age alone.`,
                basis: [
                    vehicle.warrantyValidTill
                        ? `Warranty expired ${formatDate(vehicle.warrantyValidTill)}`
                        : 'No warranty expiry on record',
                    `${vehicle.year} vehicle at ${formatKm(vehicle.odometerKm)}`,
                ],
                priority: 'Routine',
            });
        }
    }

    const order: Record<Recommendation['priority'], number> = { Urgent: 0, Soon: 1, Routine: 2 };
    return out.sort((a, b) => order[a.priority] - order[b.priority]);
}
