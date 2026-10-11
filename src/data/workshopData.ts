/**
 * workshopData.ts — the service-centre dataset behind both dashboards.
 *
 * Stands in for GET /api/customers, /api/vehicles, /api/bookings and
 * /api/service-records until there is a backend. Deliberately ordinary
 * cars with plausible odometer readings and Indian plates: a service
 * centre's book is full of Baleno oil changes, not hypercars.
 *
 * The bookable services are derived from the marketing catalogue in
 * homeData, so the price a customer is quoted in the dashboard is the
 * same number the homepage advertises.
 */

import { FEATURED_SERVICE, SERVICES } from './homeData';
import type {
    Booking, Customer, OwnedVehicle, ServiceOption, ServiceRecord,
} from '../types/workshop';

/* ── Dates ─────────────────────────────────────────────────────
   Fixtures are dated relative to today rather than frozen in a
   month that has since passed: a dashboard whose "upcoming"
   bookings are all in the past stops demonstrating anything.
   `days(-30)` is a month ago, `days(8)` is next week. */

const MS_PER_DAY = 86_400_000;

export function days(offset: number): string {
    const date = new Date(Date.now() + offset * MS_PER_DAY);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
}

/** Calendar-month arithmetic, for insurance and warranty expiry. */
export function months(offset: number): string {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth() + offset, now.getDate());
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
}

/** The signed-in owner the user dashboard is rendered for. Stands in
 *  for a session, which this project deliberately does not have. */
export const CURRENT_CUSTOMER_ID = 'cust-001';

/* ── Bookable services ─────────────────────────────────────────
   "₹4,200" in the brochure becomes 4200 here, so estimates can be
   summed and formatted rather than concatenated. */

const toRupees = (from: string) => Number(from.replace(/[^\d]/g, ''));

export const SERVICE_OPTIONS: ServiceOption[] = [FEATURED_SERVICE, ...SERVICES].map(s => ({
    slug: s.slug,
    name: s.name,
    fromPrice: toRupees(s.from),
    duration: s.duration,
    summary: s.summary,
}));

export const findService = (slug: string): ServiceOption | undefined =>
    SERVICE_OPTIONS.find(s => s.slug === slug);

/** Drop-off slots the booking form offers. The workshop opens at 8 and
 *  stops taking cars in at 16:00 so same-day work can finish. */
export const BOOKING_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00',
] as const;

/** Technicians available to assign — names match the Technicians tab. */
export const TECHNICIANS = [
    'Rajan Kumar', 'Suresh Patil', 'Amit Desai', 'Karan Mehta', 'Deepak Singh',
] as const;

/* ── Customers ─────────────────────────────────────────────── */

export const CUSTOMERS: Customer[] = [
    {
        id: 'cust-001', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com',
        phone: '+91 98201 44120', city: 'Mumbai', plan: 'Premium',
        status: 'Active', joinedOn: '2021-08-14',
    },
    {
        id: 'cust-002', name: 'Priya Nair', email: 'priya.nair@outlook.com',
        phone: '+91 98450 71903', city: 'Bengaluru', plan: 'Basic',
        status: 'Active', joinedOn: '2022-02-03',
    },
    {
        id: 'cust-003', name: 'Vikram Singh', email: 'vikram.singh@yahoo.in',
        phone: '+91 99103 55820', city: 'Delhi', plan: 'Premium',
        status: 'Active', joinedOn: '2020-11-27',
    },
    {
        id: 'cust-004', name: 'Neha Kapoor', email: 'neha.kapoor@gmail.com',
        phone: '+91 98330 12477', city: 'Pune', plan: 'Basic',
        status: 'Active', joinedOn: '2023-06-19',
    },
    {
        id: 'cust-005', name: 'Rohit Verma', email: 'rohit.verma@rediffmail.com',
        phone: '+91 97400 68351', city: 'Mumbai', plan: 'Premium',
        status: 'Active', joinedOn: '2019-04-08',
    },
    {
        id: 'cust-006', name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com',
        phone: '+91 96320 90714', city: 'Chennai', plan: 'Basic',
        status: 'Inactive', joinedOn: '2024-01-22',
    },
];

/* ── Vehicles ──────────────────────────────────────────────── */

export const OWNED_VEHICLES: OwnedVehicle[] = [
    {
        id: 'veh-001', ownerId: 'cust-001',
        make: 'BMW', model: '3 Series', variant: '320d M Sport', year: 2022,
        registration: 'MH 12 QR 4821', fuel: 'Diesel',
        odometerKm: 42850, status: 'In Service',
        lastServiceOn: days(-27), nextServiceKm: 45000,
        insuranceValidTill: months(6), warrantyValidTill: months(11),
        healthScore: 86,
    },
    {
        id: 'veh-002', ownerId: 'cust-001',
        make: 'Maruti Suzuki', model: 'Baleno', variant: 'Zeta', year: 2019,
        registration: 'MH 02 DK 7340', fuel: 'Petrol',
        odometerKm: 71420, status: 'At Home',
        lastServiceOn: days(-131), nextServiceKm: 75000,
        insuranceValidTill: months(1), warrantyValidTill: null,
        healthScore: 72,
    },
    {
        id: 'veh-003', ownerId: 'cust-002',
        make: 'Hyundai', model: 'Creta', variant: 'SX(O) Turbo', year: 2021,
        registration: 'KA 05 MJ 1198', fuel: 'Petrol',
        odometerKm: 58300, status: 'Awaiting Parts',
        lastServiceOn: days(-82), nextServiceKm: 60000,
        insuranceValidTill: months(3), warrantyValidTill: months(-1),
        healthScore: 68,
    },
    {
        id: 'veh-004', ownerId: 'cust-003',
        make: 'Mahindra', model: 'XUV700', variant: 'AX7 L', year: 2023,
        registration: 'DL 08 CF 9052', fuel: 'Diesel',
        odometerKm: 26140, status: 'In Service',
        lastServiceOn: days(-60), nextServiceKm: 30000,
        insuranceValidTill: months(9), warrantyValidTill: months(26),
        healthScore: 91,
    },
    {
        id: 'veh-005', ownerId: 'cust-004',
        make: 'Honda', model: 'City', variant: 'VX CVT', year: 2018,
        registration: 'MH 14 GT 2267', fuel: 'Petrol',
        odometerKm: 96780, status: 'Ready for Pickup',
        lastServiceOn: days(-40), nextServiceKm: 100000,
        insuranceValidTill: months(-2), warrantyValidTill: null,
        healthScore: 61,
    },
    {
        id: 'veh-006', ownerId: 'cust-005',
        make: 'Toyota', model: 'Fortuner', variant: '4x4 AT', year: 2020,
        registration: 'MH 01 AT 6613', fuel: 'Diesel',
        odometerKm: 84210, status: 'At Home',
        lastServiceOn: days(-45), nextServiceKm: 90000,
        insuranceValidTill: months(2), warrantyValidTill: null,
        healthScore: 79,
    },
    {
        id: 'veh-007', ownerId: 'cust-006',
        make: 'Tata', model: 'Nexon EV', variant: 'Max XZ+', year: 2022,
        registration: 'TN 09 BW 4405', fuel: 'Electric',
        odometerKm: 31560, status: 'At Home',
        lastServiceOn: days(-152), nextServiceKm: 35000,
        insuranceValidTill: months(4), warrantyValidTill: months(48),
        healthScore: 88,
    },
];

/* ── Bookings ──────────────────────────────────────────────────
   Two jobs are in the workshop today, three are ahead, and the rest
   have been and gone — enough spread that every status in the
   pipeline is represented without inventing fifty rows. */

export const BOOKINGS: Booking[] = [
    {
        id: 'SRV-9201', customerId: 'cust-001', vehicleId: 'veh-001',
        serviceSlug: 'brake-service', serviceName: 'Brake Inspection',
        scheduledFor: days(4), slot: '09:00', bay: 'Bay 3',
        technician: 'Suresh Patil', status: 'Confirmed', estimate: 4200,
        notes: 'Pedal pulses under heavy braking above 80 km/h.',
    },
    {
        id: 'SRV-9194', customerId: 'cust-001', vehicleId: 'veh-002',
        serviceSlug: 'periodic-maintenance', serviceName: 'Periodic Maintenance',
        scheduledFor: days(12), slot: '11:00', bay: null,
        technician: null, status: 'Pending', estimate: 3400,
        notes: '75,000 km service — please check the AC blower as well.',
    },
    {
        id: 'SRV-9188', customerId: 'cust-002', vehicleId: 'veh-003',
        serviceSlug: 'ac-cooling', serviceName: 'AC & Cooling',
        scheduledFor: days(0), slot: '10:00', bay: 'Bay 1',
        technician: 'Rajan Kumar', status: 'In Service', estimate: 2600,
        notes: 'Cooling drops in traffic. Condenser fan suspected.',
    },
    {
        id: 'SRV-9176', customerId: 'cust-003', vehicleId: 'veh-004',
        serviceSlug: 'diagnostics', serviceName: 'Diagnostics',
        scheduledFor: days(0), slot: '08:00', bay: 'Bay 5',
        technician: 'Amit Desai', status: 'In Service', estimate: 1800,
        notes: 'Intermittent EML with no loss of power.',
    },
    {
        id: 'SRV-9165', customerId: 'cust-004', vehicleId: 'veh-005',
        serviceSlug: 'periodic-maintenance', serviceName: 'Periodic Maintenance',
        scheduledFor: days(-1), slot: '09:00', bay: 'Bay 2',
        technician: 'Deepak Singh', status: 'Completed', estimate: 3400,
    },
    {
        id: 'SRV-9158', customerId: 'cust-005', vehicleId: 'veh-006',
        serviceSlug: 'brake-service', serviceName: 'Brake Service',
        scheduledFor: days(7), slot: '14:00', bay: null,
        technician: null, status: 'Pending', estimate: 4200,
        notes: 'Rear pads replaced elsewhere last year — please verify.',
    },
    {
        id: 'SRV-9143', customerId: 'cust-002', vehicleId: 'veh-003',
        serviceSlug: 'detailing', serviceName: 'Detailing',
        scheduledFor: days(-6), slot: '08:00', bay: 'Bay 7',
        technician: 'Karan Mehta', status: 'Cancelled', estimate: 9000,
        notes: 'Owner rescheduled — ceramic coating to follow the AC repair.',
    },
    {
        id: 'SRV-9130', customerId: 'cust-006', vehicleId: 'veh-007',
        serviceSlug: 'diagnostics', serviceName: 'Diagnostics',
        scheduledFor: days(10), slot: '13:00', bay: null,
        technician: null, status: 'Confirmed', estimate: 1800,
        notes: 'Range dropped roughly 12% since the last software update.',
    },
];

/* ── Completed work ───────────────────────────────────────────── */

export const SERVICE_RECORDS: ServiceRecord[] = [
    {
        id: 'SRV-8974', customerId: 'cust-001', vehicleId: 'veh-001',
        serviceName: 'Periodic Maintenance', completedOn: days(-27),
        technician: 'Rajan Kumar', odometerKm: 42100, cost: 11480,
        rating: 5, invoiceId: 'INV-2026-0341',
        workDone: [
            'Engine oil and filter — 5W-30 LL-04, 6.5 L',
            'Cabin and air filter replacement',
            '42-point inspection report issued',
            'Front pads measured at 3.1 mm',
        ],
    },
    {
        id: 'SRV-8802', customerId: 'cust-001', vehicleId: 'veh-002',
        serviceName: 'Periodic Maintenance', completedOn: days(-131),
        technician: 'Deepak Singh', odometerKm: 68940, cost: 6240,
        rating: 4, invoiceId: 'INV-2025-0298',
        workDone: [
            'Engine oil and filter — 5W-30, 3.1 L',
            'Brake fluid top-up, DOT 4',
            'Wheel alignment and balancing',
        ],
    },
    {
        id: 'SRV-8655', customerId: 'cust-001', vehicleId: 'veh-001',
        serviceName: 'AC & Cooling', completedOn: days(-204),
        technician: 'Suresh Patil', odometerKm: 36420, cost: 5890,
        rating: 5, invoiceId: 'INV-2025-0211',
        workDone: [
            'R1234yf regas, 580 g',
            'Leak trace with UV dye — no loss found',
            'Cabin filter replacement',
        ],
    },
    {
        id: 'SRV-8491', customerId: 'cust-001', vehicleId: 'veh-002',
        serviceName: 'Brake Service', completedOn: days(-305),
        technician: 'Karan Mehta', odometerKm: 61230, cost: 8150,
        rating: 5, invoiceId: 'INV-2025-0147',
        workDone: [
            'Front pads and discs replaced',
            'Rear drums cleaned and adjusted',
            'Bed-in procedure completed on road test',
        ],
    },
    {
        id: 'SRV-8310', customerId: 'cust-001', vehicleId: 'veh-001',
        serviceName: 'Diagnostics', completedOn: days(-402),
        technician: 'Amit Desai', odometerKm: 28760, cost: 1800,
        rating: null, invoiceId: 'INV-2025-0063',
        workDone: [
            'Manufacturer-protocol scan — 2 stored codes',
            'Live data logged over a 24 km road test',
            'Fee waived against the repair that followed',
        ],
    },
    {
        id: 'SRV-9165', customerId: 'cust-004', vehicleId: 'veh-005',
        serviceName: 'Periodic Maintenance', completedOn: days(-1),
        technician: 'Deepak Singh', odometerKm: 96780, cost: 9340,
        rating: 4, invoiceId: 'INV-2026-0352',
        workDone: [
            'Engine oil and filter — 5W-30, 3.5 L',
            'CVT fluid inspection',
            'Rear suspension bushes flagged for replacement',
        ],
    },
    {
        id: 'SRV-9088', customerId: 'cust-003', vehicleId: 'veh-004',
        serviceName: 'Periodic Maintenance', completedOn: days(-60),
        technician: 'Rajan Kumar', odometerKm: 24980, cost: 8720,
        rating: 5, invoiceId: 'INV-2026-0288',
        workDone: [
            'Engine oil and filter — 5W-30, 5.5 L',
            'Fuel filter replacement',
            '42-point inspection report issued',
        ],
    },
    {
        id: 'SRV-9042', customerId: 'cust-005', vehicleId: 'veh-006',
        serviceName: 'Diagnostics', completedOn: days(-45),
        technician: 'Amit Desai', odometerKm: 83600, cost: 1800,
        rating: 5, invoiceId: 'INV-2026-0271',
        workDone: [
            'Manufacturer-protocol scan — DPF differential pressure',
            'Forced regeneration performed',
        ],
    },
    {
        id: 'SRV-8921', customerId: 'cust-002', vehicleId: 'veh-003',
        serviceName: 'Brake Service', completedOn: days(-82),
        technician: 'Suresh Patil', odometerKm: 56110, cost: 7420,
        rating: 4, invoiceId: 'INV-2026-0192',
        workDone: [
            'Front pads replaced, discs skimmed',
            'DOT 4 fluid exchange',
        ],
    },
    {
        id: 'SRV-8745', customerId: 'cust-006', vehicleId: 'veh-007',
        serviceName: 'Periodic Maintenance', completedOn: days(-152),
        technician: 'Karan Mehta', odometerKm: 29870, cost: 4180,
        rating: null, invoiceId: 'INV-2025-0274',
        workDone: [
            'Battery coolant level and pack health check',
            'Brake fluid exchange, DOT 4',
            'Software version verified against latest release',
        ],
    },
];

/* ── Workshop bays ─────────────────────────────────────────────
   Shared by the admin overview and the bay assignment control. */

export const BAYS = ['Bay 1', 'Bay 2', 'Bay 3', 'Bay 4', 'Bay 5', 'Bay 6', 'Bay 7'] as const;
