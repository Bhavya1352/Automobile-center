/**
 * workshopService.ts — the data layer behind both dashboards.
 *
 * Same contract as carService: every function is async and simulates
 * latency, so the loading states in the UI are exercised in
 * development rather than flashing past. Replacing the body of each
 * function with `fetch('/api/…')` is the only change a real backend
 * would require; no component imports this module directly.
 */

import {
    BOOKINGS, CUSTOMERS, OWNED_VEHICLES, SERVICE_RECORDS, findService,
} from '../data/workshopData';
import { formatKm, formatRupees } from '../lib/format';
import type {
    Booking, Customer, OwnedVehicle, ServiceRecord, VehicleCheckResult,
} from '../types/workshop';

const MIN_LATENCY_MS = 220;
const LATENCY_JITTER_MS = 380;

const simulateLatency = (scale = 1) =>
    new Promise<void>(resolve =>
        setTimeout(resolve, (MIN_LATENCY_MS + Math.random() * LATENCY_JITTER_MS) * scale),
    );

/** Snapshot of everything the dashboards need, in one round trip. The
 *  arrays are copies: a mutation in the UI must go through the
 *  provider, never reach back into the module-level fixtures. */
export interface WorkshopSnapshot {
    customers: Customer[];
    vehicles: OwnedVehicle[];
    bookings: Booking[];
    records: ServiceRecord[];
}

export async function fetchWorkshop(): Promise<WorkshopSnapshot> {
    await simulateLatency();
    return {
        customers: CUSTOMERS.map(c => ({ ...c })),
        vehicles: OWNED_VEHICLES.map(v => ({ ...v })),
        bookings: BOOKINGS.map(b => ({ ...b })),
        records: SERVICE_RECORDS.map(r => ({ ...r, workDone: [...r.workDone] })),
    };
}

/** Stands in for the write that a real POST/PATCH would perform. The
 *  provider has already updated its own state optimistically; this is
 *  the acknowledgement it waits on before reporting success. */
export async function persistChange(): Promise<void> {
    await simulateLatency(0.5);
}

/* ── AI vehicle check ──────────────────────────────────────────
   A deterministic symptom matcher, not a language model: the
   phrases below are the ones owners actually use, mapped to the
   service that addresses them. Honest about being a triage step,
   which is exactly what the homepage claims it is. */

interface SymptomRule {
    /** Any of these in the description selects the rule. */
    keywords: string[];
    serviceSlug: string;
    likelyCause: string;
    urgency: VehicleCheckResult['urgency'];
    urgencyNote: string;
}

const SYMPTOM_RULES: SymptomRule[] = [
    {
        keywords: ['brake', 'braking', 'pedal', 'squeal', 'grinding', 'vibrat', 'juddr', 'judder', 'stopping'],
        serviceSlug: 'brake-service',
        likelyCause:
            'That pattern usually points to brake rotor imbalance or uneven pad wear — most often on the front axle. Vibration felt through the steering wheel rather than the pedal supports this.',
        urgency: 'Service soon',
        urgencyNote: 'Safe to drive, but avoid hard braking until the discs have been measured.',
    },
    {
        keywords: ['ac', 'a/c', 'air con', 'cooling', 'cold', 'hot', 'overheat', 'temperature', 'coolant', 'radiator', 'blower'],
        serviceSlug: 'ac-cooling',
        likelyCause:
            'Cooling that fades in traffic and recovers at speed points to airflow across the condenser rather than refrigerant charge — typically a tired condenser fan or a blocked matrix.',
        urgency: 'Monitor',
        urgencyNote: 'Not a safety issue, but a failing fan will eventually affect engine cooling too.',
    },
    {
        keywords: ['warning light', 'engine light', 'eml', 'check engine', 'error', 'code', 'dashboard light', 'limp'],
        serviceSlug: 'diagnostics',
        likelyCause:
            'An intermittent warning light with no loss of power is usually a sensor reporting out of range rather than a mechanical fault. The stored code and live data will separate the two.',
        urgency: 'Service soon',
        urgencyNote: 'Drive normally, but have the code read before the fault becomes permanent.',
    },
    {
        keywords: ['power', 'sluggish', 'slow', 'acceleration', 'turbo', 'smoke', 'dpf', 'fuel', 'mileage', 'economy'],
        serviceSlug: 'performance-ecu',
        likelyCause:
            'A gradual loss of pull together with worse economy on a diesel most often traces to a partially blocked DPF or an EGR valve sticking, not to the engine itself.',
        urgency: 'Service soon',
        urgencyNote: 'Driveable, though repeated short trips will make a blocked filter worse.',
    },
    {
        keywords: ['noise', 'knock', 'rattle', 'clunk', 'bump', 'suspension', 'steering', 'pull', 'alignment', 'tyre', 'tire'],
        serviceSlug: 'periodic-maintenance',
        likelyCause:
            'A knock over bumps that disappears on smooth road is almost always suspension linkage — a drop link or anti-roll bar bush — rather than a damper.',
        urgency: 'Monitor',
        urgencyNote: 'Worth inspecting at the next service unless the noise becomes constant.',
    },
    {
        keywords: ['start', 'battery', 'crank', 'dead', 'electrical', 'charge', 'range'],
        serviceSlug: 'diagnostics',
        likelyCause:
            'Slow cranking that improves after a long drive points to a battery no longer holding charge, or a charging system not replenishing it on short trips.',
        urgency: 'Urgent',
        urgencyNote: 'A battery at this stage can fail without further warning — have it load-tested.',
    },
];

/** When nothing matches, say so and offer the service that exists
 *  precisely for "I cannot describe it": diagnostics. */
const FALLBACK_RULE: SymptomRule = {
    keywords: [],
    serviceSlug: 'diagnostics',
    likelyCause:
        'Nothing in that description matches a pattern this check recognises, which does not mean nothing is wrong. A diagnostic session reads live data across the drivetrain and reproduces the fault on the road.',
    urgency: 'Monitor',
    urgencyNote: 'No evidence of an unsafe condition from the description alone.',
};

export interface VehicleCheckInput {
    symptom: string;
    vehicle: OwnedVehicle;
    /** The vehicle's own completed work, used as the basis for the call. */
    records: ServiceRecord[];
}

export async function runVehicleCheck(
    { symptom, vehicle, records }: VehicleCheckInput,
): Promise<VehicleCheckResult> {
    // Longer than a read: the UI shows a distinct "analysing" state.
    await simulateLatency(2.5);

    const text = symptom.toLowerCase();
    const rule = SYMPTOM_RULES.find(r => r.keywords.some(k => text.includes(k))) ?? FALLBACK_RULE;
    const service = findService(rule.serviceSlug);

    const last = records
        .filter(r => r.vehicleId === vehicle.id)
        .sort((a, b) => b.completedOn.localeCompare(a.completedOn))[0];

    const basis = [
        `${vehicle.year} ${vehicle.make} ${vehicle.model} at ${formatKm(vehicle.odometerKm)}`,
        last
            ? `Last visit: ${last.serviceName} at ${formatKm(last.odometerKm)} — ${vehicle.odometerKm - last.odometerKm > 0
                ? `${formatKm(vehicle.odometerKm - last.odometerKm)} ago`
                : 'this reading'}`
            : 'No service history recorded with us for this vehicle',
        `Next service falls due at ${formatKm(vehicle.nextServiceKm)}`,
    ];

    const relevant = records.filter(
        r => r.vehicleId === vehicle.id && r.serviceName.toLowerCase().includes(
            (service?.name ?? '').split(' ')[0].toLowerCase(),
        ),
    );
    if (relevant.length > 0) {
        basis.push(`${relevant.length} previous ${service?.name} visit${relevant.length > 1 ? 's' : ''} on record`);
    }

    return {
        symptom: symptom.trim(),
        vehicleLabel: `${vehicle.make} ${vehicle.model} · ${vehicle.year} · ${formatKm(vehicle.odometerKm)}`,
        likelyCause: rule.likelyCause,
        basis,
        urgency: rule.urgency,
        urgencyNote: rule.urgencyNote,
        recommendedSlug: rule.serviceSlug,
        recommendedName: service?.name ?? 'Diagnostics',
        recommendedMeta: service
            ? `${service.name} · from ${formatRupees(service.fromPrice)} · ${service.duration}`
            : 'Diagnostics',
    };
}
